import {ComponentType, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {Inject, Injectable, Injector, NgZone, OnDestroy} from '@angular/core';
import {Actions, ofActionDispatched, Store} from '@ngxs/store';
import {merge, Subject} from 'rxjs';
import {filter, first, takeUntil} from 'rxjs/operators';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {DragEndAction} from '../../../states/editor/drag/drag-end.action';
import {DragInsideEditorAction} from '../../../states/editor/drag/drag-inside-editor.action';
import {AniOpenCloseEnum} from '../../animations/animations.typets';
import {LogService} from '../../dev-tools/log/log.service';
import {EditorModalInterface} from '../../editor/editor-modal-interface';
import {EDITOR_MODAL_TOKEN} from '../../editor/editor-modal-token';

@Injectable({providedIn: 'root'})
export class DragOverlayService implements OnDestroy {

    private _component: any;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    private _overlayRef: OverlayRef;

    public constructor(private _store: Store,
                       private _overlay: Overlay,
                       private _injector: Injector,
                       private _zone: NgZone,
                       private _actions$: Actions,
                       @Inject(EDITOR_MODAL_TOKEN) private _editorModal: EditorModalInterface,
                       log: LogService) {
        this._log = log.withPrefix(DragOverlayService.name);
    }

    public close() {
        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._log.debug('_detach');
            this._overlayRef.detach();
        }
        if (this._component) {
            this._log.debug('_component = null');
            this._component = null;
        }
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public open<TType>(component: ComponentType<TType>): Promise<TType> {
        return new Promise(resolver => {
            this._log.debug('_createComponent');
            const overlayRef = this._createOverlay();
            const portal = new ComponentPortal(component);
            this._component = overlayRef.attach(portal).instance;

            const done$ = merge(overlayRef.detachments(), this._destroyed$);

            this._actions$.pipe(
                ofActionDispatched(DragInsideEditorAction),
                takeUntil(done$)
            ).subscribe((action: DragInsideEditorAction) => this._handleEditorOpening(action));

            this._actions$.pipe(
                ofActionDispatched(DragEndAction),
                first(),
                takeUntil(done$)
            ).subscribe(() => this.close());

            this._zone.onStable.pipe(first()).subscribe(() => resolver(this._component));
        });
    }

    private _bringToTop() {
        if (this._overlayRef) {
            const parent = this._overlayRef.hostElement.parentElement;
            parent.appendChild(this._overlayRef.hostElement);
        }
    }

    private _createOverlay(): OverlayRef {
        this._log.debug('_createOverlay');
        this.close();

        if (this._overlayRef) {
            return this._overlayRef;
        }

        this._overlayRef = this._overlay.create({hasBackdrop: false});
        this._overlayRef.detachments()
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                this._log.debug('_overlayRef.detachments');
                this.close();
            });

        return this._overlayRef;
    }

    private _handleEditorOpening(action: DragInsideEditorAction) {
        this._store.select(CardEditorState.editorState).pipe(
            filter(state => state === AniOpenCloseEnum.OPENING),
            first(),
            takeUntil(merge(this._overlayRef.detachments(), this._destroyed$))
        ).subscribe(() => this._bringToTop());
        this._editorModal.edit(action.card_id, false);
    }
}
