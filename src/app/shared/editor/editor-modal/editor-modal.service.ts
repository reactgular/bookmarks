import {ComponentType, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {Inject, Injector, NgZone, OnDestroy} from '@angular/core';
import {Store} from '@ngxs/store';
import {BehaviorSubject, combineLatest, Observable, of, Subject} from 'rxjs';
import {filter, first, takeUntil} from 'rxjs/operators';
import {CardEditorCardIdAction} from '../../../states/editor/card-editor/card-editor-card-id.action';
import {CardEditorItemIdAction} from '../../../states/editor/card-editor/card-editor-item-id.action';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {CardsCreateAction} from '../../../states/storage/cards/cards-create.action';
import {ItemsCreateAction} from '../../../states/storage/items/items-create.action';
import {AniOpenCloseEnum} from '../../animations/animations.typets';
import {LogService} from '../../dev-tools/log/log.service';
import {WINDOW} from '../../dev-tools/window-token';
import {EntityIdType} from '../../networks/networks.types';
import {EditorDialogClosable} from '../editor-dialog-closable';
import {EDITOR_DIALOG_TOKEN} from '../editor-dialog-token';
import {EditorModalInterface} from '../editor-modal-interface';
import {EDITOR_DATA, EditorData} from '../editor-types';
import {EditorQuery} from './editor.query';

export class EditorModalService implements OnDestroy, EditorModalInterface {
    private readonly _destroyed$: Subject<void> = new Subject();

    private _dialogClosed$: Subject<void>;

    private _editorDialogInstance: EditorDialogClosable;

    private readonly _log: LogService;

    private _overlayRef: OverlayRef;

    private _query$: Subject<EditorQuery> = new Subject();

    private _triggerClose$: BehaviorSubject<boolean>;

    public constructor(private _store: Store,
                       private _overlay: Overlay,
                       private _injector: Injector,
                       private _zone: NgZone,
                       @Inject(WINDOW) private _wnd: Window,
                       @Inject(EDITOR_DIALOG_TOKEN) private _componentType: ComponentType<EditorDialogClosable>,
                       log: LogService) {
        this._log = log.withPrefix(EditorModalService.name);
    }

    public close(): Observable<void> {
        if (this._triggerClose$) {
            this._triggerClose$.next(true);
            return this._dialogClosed$.asObservable();
        }
        return of(undefined);
    }

    public create(): Promise<void> {
        return new Promise(resolver => {
            const createCard = new CardsCreateAction(this._zone);
            createCard.done$.subscribe(cardId => {
                const createItem = new ItemsCreateAction(this._zone, cardId);
                createItem.done$.subscribe(itemId => {
                    this._open(cardId)
                        .then(() => {
                            this._store.dispatch(new CardEditorItemIdAction(itemId, false)).subscribe(() => resolver());
                        });
                });
                this._store.dispatch(createItem);
            });
            this._store.dispatch(createCard);
        });
    }

    public edit(cardId: EntityIdType, focusTitle: boolean, itemId?: EntityIdType): Promise<void> {
        return new Promise(resolver => {
            const createItem = new ItemsCreateAction(this._zone, cardId);
            createItem.done$.subscribe(() => {
                this._open(cardId).then(() => {
                    if (itemId !== undefined) {
                        this._store.dispatch(new CardEditorItemIdAction(itemId, focusTitle)).subscribe(() => resolver());
                    } else {
                        resolver();
                    }
                });
            });
            this._store.dispatch(createItem);
        });
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public query(): Observable<EditorQuery> {
        return this._query$;
    }

    private _createDialog(from: ClientRect | DOMRect) {
        this._log.debug('_createDialog');
        const overlayRef = this._createOverlay();
        const toPromise = (id: EntityIdType) => this._queryPromise(id);

        const injector = new PortalInjector(this._injector, new WeakMap([
            [EDITOR_DATA, {
                from,
                to: toPromise
            } as EditorData]
        ]));
        const portal = new ComponentPortal(this._componentType, null, injector);

        this._dialogClosed$ = new Subject();
        this._triggerClose$ = new BehaviorSubject(false);

        this._editorDialogInstance = overlayRef.attach(portal).instance;

        this._editorDialogInstance.closing.pipe(
            first(),
            takeUntil(this._destroyed$)
        ).subscribe(() => {
            this._log.debug('_editorDialogInstance.closing');
            if (this._overlayRef) {
                this._log.debug('_overlayRef.detachBackdrop');
                this._overlayRef.detachBackdrop();
            }
        });

        this._editorDialogInstance.closed.pipe(
            first(),
            takeUntil(this._destroyed$)
        ).subscribe(() => {
            this._log.debug('_editorDialogInstance.closed');
            this._wnd.setTimeout(() => this._detach());
        });

        // Designed to trigger the closing of the editor after it has finished opening. This resolves change detection errors when
        // the user triggers the close action while the opening animation is happening.
        combineLatest([
            this._triggerClose$,
            this._store.select(CardEditorState.editorState)
        ]).pipe(
            filter(([triggerClose, editorState]) => triggerClose && editorState === AniOpenCloseEnum.OPEN),
            first(),
            takeUntil(this._destroyed$)
        ).subscribe(() => {
            this._editorDialogInstance.close().subscribe(() => this._dialogClosed$.next());
        });
    }

    /** Create the overlay config and position strategy */
    private _createOverlay(): OverlayRef {
        this._log.debug('_createOverlay');
        this._detach();

        if (this._overlayRef) {
            return this._overlayRef;
        }

        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: ''
        });

        this._overlayRef.detachments()
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                this._log.debug('_overlayRef.detachments');
                this._detach();
            });

        this._overlayRef.backdropClick()
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                this._log.debug('_overlayRef.backdropClick');
                this.close();
            });

        return this._overlayRef;
    }

    /** Detaches the currently-attached tooltip. */
    private _detach() {
        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._log.debug('_detach');
            this._overlayRef.detach();
        }
        if (this._editorDialogInstance) {
            this._log.debug('_editorDialogInstance = null');
            this._editorDialogInstance = null;
            if (this._triggerClose$) {
                this._triggerClose$.complete();
                this._triggerClose$ = null;
            }
            if (this._dialogClosed$) {
                this._dialogClosed$.complete();
                this._dialogClosed$ = null;
            }
        }
    }

    private _open(cardId: EntityIdType): Promise<void> {
        this._log.debug('open');
        return new Promise(resolver => {
            this._store
                .dispatch(new CardEditorCardIdAction(cardId))
                .subscribe(() => {
                    this._queryPromise(cardId).then(from => {
                        this._createDialog(from);
                        this._store.select(CardEditorState.editorState)
                            .pipe(
                                filter(state => state === AniOpenCloseEnum.OPEN),
                                first(),
                                takeUntil(this._destroyed$)
                            )
                            .subscribe(() => resolver());
                    });
                });
        });
    }

    private _queryPromise(cardId: EntityIdType): Promise<ClientRect | DOMRect> {
        return new Promise(resolver => {
            this._query$.next({cardId, done: (rect) => resolver(rect)});
        });
    }
}
