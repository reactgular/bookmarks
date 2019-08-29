import {ComponentType} from '@angular/cdk/portal';
import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngxs/store';
import {merge, Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {AppSequenceAction} from '../../../states/app/app-sequence.action';
import {DragEndAction} from '../../../states/editor/drag/drag-end.action';
import {DragStartAction} from '../../../states/editor/drag/drag-start.action';
import {DragVisibleAction} from '../../../states/editor/drag/drag-visible.action';
import {DragStateEnum, DragType} from '../../../states/models/drag-model';
import {Point} from '../../../utils/shapes/point';
import {KeyboardService} from '../../dev-tools/keyboard/keyboard.service';
import {LogService} from '../../dev-tools/log/log.service';
import {EntityIdType} from '../../networks/networks.types';
import {DragEventsService} from '../drag-events/drag-events.service';
import {DragOverlayService} from '../drag-overlay/drag-overlay.service';
import {DRAG_CARD_TOKEN, DRAG_DOCUMENT_TOKEN, DRAG_ITEM_TOKEN} from '../drag-tokens';

@Injectable({providedIn: 'root'})
export class DragBehaviorService implements OnDestroy {
    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _dragOverlay: DragOverlayService,
                       private _dragEvents: DragEventsService,
                       private _keyboard: KeyboardService,
                       @Inject(DRAG_CARD_TOKEN) private _dragCardComponent: ComponentType<any>,
                       @Inject(DRAG_ITEM_TOKEN) private _dragItemComponent: ComponentType<any>,
                       @Inject(DRAG_DOCUMENT_TOKEN) private _dragDocumentComponent: ComponentType<any>,
                       log: LogService) {
        this._log = log.withPrefix(DragBehaviorService.name);
    }

    public dragCard(cardId: EntityIdType, offset: Point, move: Point, size: Point): Promise<void> {
        return new Promise(resolver => {
            const dragType: DragType = 'card';
            this._store.dispatch(new DragStartAction(
                dragType,
                DragStateEnum.SORT_CARDS,
                cardId
            )).subscribe(() => {
                this._dragOverlay.open(this._dragCardComponent).then(() => {
                    this._dragEvents.start(offset, move, size);
                    this._ctrlToggleVisible(dragType, cardId);
                    this._dragEnd(dragType, cardId);
                    resolver();
                });
            });
        });
    }

    public dragDocument(documentId: EntityIdType, offset: Point, move: Point, size: Point): Promise<void> {
        return new Promise(resolver => {
            const dragType: DragType = 'document';
            this._store.dispatch(new DragStartAction(
                dragType,
                DragStateEnum.SORT_DOCUMENTS,
                documentId
            )).subscribe(() => {
                this._dragOverlay.open(this._dragDocumentComponent).then(() => {
                    this._dragEvents.start(offset, move, size, 'grabbing');
                    this._ctrlToggleVisible(dragType, documentId);
                    this._dragEnd(dragType, documentId);
                    resolver();
                });
            });
        });
    }

    public dragItem(itemId: EntityIdType, offset: Point, move: Point, size: Point): Promise<void> {
        return new Promise(resolver => {
            const dragType: DragType = 'item';
            this._store.dispatch(new DragStartAction(
                dragType,
                DragStateEnum.SORT_ITEMS,
                itemId
            )).subscribe(() => {
                this._dragOverlay.open(this._dragItemComponent).then(() => {
                    this._dragEvents.start(offset, move, size, 'grabbing');
                    this._ctrlToggleVisible(dragType, itemId);
                    this._dragEnd(dragType, itemId);
                    resolver();
                });
            });
        });
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    private _ctrlToggleVisible(dragType: DragType, dragId: EntityIdType) {
        this._keyboard.ctrl$.pipe(
            this._log.stream('ctrlToggleVisible'),
            takeUntil(merge(this._dragEvents.onEnd(), this._destroyed$))
        ).subscribe(ctrl => this._store.dispatch(new DragVisibleAction(dragType, dragId, ctrl)));
    }

    private _dragEnd(dragType: DragType, dragId: EntityIdType) {
        this._dragEvents.onEnd()
            .pipe(
                first(),
                this._log.stream('dragEnd'),
                takeUntil(this._destroyed$)
            )
            .subscribe(() => this._store.dispatch(new AppSequenceAction([
                new DragVisibleAction(dragType, dragId, true),
                new DragEndAction()
            ])));
    }
}
