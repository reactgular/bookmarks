import {ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {filter, first, map, takeUntil, withLatestFrom} from 'rxjs/operators';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {CardsDropItemAction} from '../../../states/storage/cards/cards-drop-item.action';
import {DragOutsideEditorAction} from '../../../states/editor/drag/drag-outside-editor.action';
import {DragStateAction} from '../../../states/editor/drag/drag-state.action';
import {DragVisibleAction} from '../../../states/editor/drag/drag-visible.action';
import {DragState} from '../../../states/editor/drag/drag.state';
import {ItemsCloneAction} from '../../../states/storage/items/items-clone.action';
import {AniOpenCloseEnum} from '../../animations/animations.typets';
import {DragStateEnum} from '../../../states/models/drag-model';
import {Rectangle} from '../../../utils/shapes/rectangle';
import {KeyboardService} from '../../dev-tools/keyboard/keyboard.service';
import {LogService} from '../../dev-tools/log/log.service';
import {DragEventsService} from '../../drag/drag-events/drag-events.service';
import {DragManagerEvent} from '../../drag/drag-manager.event';
import {EditorModalInterface} from '../../editor/editor-modal-interface';
import {EDITOR_MODAL_TOKEN} from '../../editor/editor-modal-token';
import {CardEntity} from '../../networks/entities/card.entity';
import {ItemEntity} from '../../networks/entities/item.entity';
import {EntityIdType} from '../../networks/networks.types';
import {ReactiveTool} from '../../reactive-tools/reactive-tool';
import {CardContext} from '../card-tools/card-context';
import {CARD_TOOL_TOKEN} from '../card-tools/card-tool-providers';

@Component({
    selector: 'tag-card-drag-items',
    templateUrl: './card-drag-items.component.html',
    styleUrls: ['./card-drag-items.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardDragItemsComponent implements OnInit, OnDestroy {
    @Select(CardEditorState.card)
    public card$: Observable<CardEntity>;

    public itemIds$: Observable<EntityIdType[]>;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _dragItemIds$: BehaviorSubject<EntityIdType[]> = new BehaviorSubject(null);

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _keyboard: KeyboardService,
                       private _el: ElementRef<HTMLElement>,
                       private _dragEvents: DragEventsService,
                       private _context: CardContext,
                       private _zone: NgZone,
                       @Inject(EDITOR_MODAL_TOKEN) private _editorModal: EditorModalInterface,
                       @Inject(CARD_TOOL_TOKEN) public cardTools: ReactiveTool[],
                       log: LogService) {
        this._log = log.withPrefix(CardDragItemsComponent.name);
    }

    public dragReorder(targetId: EntityIdType, above: boolean) {
        this._dragItemIds$.pipe(
            first(),
            this._log.stream('dragReorder')
        ).subscribe(itemIds => {
            itemIds = itemIds.filter(id => id !== null);
            itemIds.splice(itemIds.indexOf(targetId) + (above ? 0 : 1), 0, null);
            this._dragItemIds$.next(itemIds);
        });
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit() {
        const dragPadding = 50;
        this._dragOutside(dragPadding);
        this._dragInside(dragPadding);
        this._dragToEditor();
        this._dragStart();
        this._dragDrop();
        this._dragEnd();
        this._dragItemIds();
        this._escClose();
    }

    private _cloneAsPromise(itemId: EntityIdType, clone: boolean): Promise<EntityIdType> {
        return new Promise(resolver => {
            if (clone) {
                const action = new ItemsCloneAction(this._zone, itemId);
                action.done$.subscribe((newItemId) => resolver(newItemId));
                this._store.dispatch(action);
            } else {
                resolver(itemId);
            }
        });
    }

    private _dragDrop() {
        type Params = [DragManagerEvent, DragStateEnum, ItemEntity, CardEntity, EntityIdType[], boolean];
        this._dragEvents.onDrop().pipe(
            withLatestFrom(
                this._store.select(DragState.state),
                this._store.select(DragState.item),
                this.card$,
                this._dragItemIds$,
                this._keyboard.ctrl$
            ),
            filter(([event, state]: Params) => state === DragStateEnum.SORT_ITEMS),
            this._log.stream('dragDrop'),
            takeUntil(this._destroyed$)
        ).subscribe(([event, state, item, card, itemIds, clone]: Params) => {
            this._store.dispatch(new CardsDropItemAction(item.card_id, card.id, item.id, itemIds, clone));
        });
    }

    private _dragEnd() {
        this._dragEvents.onEnd().pipe(
            this._log.stream('dragEnd'),
            takeUntil(this._destroyed$)
        ).subscribe(() => this._dragItemIds$.next(null));
    }

    private _dragInside(dragPadding: number) {
        this._dragEvents.onMove().pipe(
            withLatestFrom(
                this._store.select(DragState.state),
                this._store.select(CardEditorState.editorState)
            ),
            filter(([event, state, editorState]: [DragManagerEvent, DragStateEnum, AniOpenCloseEnum]) => {
                const rect = Rectangle.fromRef(this._el);
                return rect.grow(dragPadding).inside(event.move)
                    && state === DragStateEnum.DRAG_TO_EDITOR
                    && editorState === AniOpenCloseEnum.OPEN;
            }),
            first(),
            this._log.stream('dragInside'),
            takeUntil(this._destroyed$)
        ).subscribe(() => this._store.dispatch(new DragStateAction(DragStateEnum.SORT_ITEMS)));
    }

    private _dragItemIds() {
        // switch to the dragItemId$ when dragging so order updates without using state storage.
        this.itemIds$ = combineLatest([
            this.card$.pipe(filter(Boolean)),
            this._dragItemIds$
        ]).pipe(map(([card, dragItemIds]: [CardEntity, EntityIdType[]]) => dragItemIds === null ? card._item_ids : dragItemIds));
    }

    private _dragOutside(dragPadding: number) {
        this._dragEvents.onMove().pipe(
            withLatestFrom(
                this._store.select(DragState.state),
                this._store.select(CardEditorState.editorState)
            ),
            filter(([event, state, editorState]: [DragManagerEvent, DragStateEnum, AniOpenCloseEnum]) => {
                const rect = Rectangle.fromRef(this._el);
                return rect.grow(dragPadding).outside(event.move)
                    && state === DragStateEnum.SORT_ITEMS
                    && editorState === AniOpenCloseEnum.OPEN;
            }),
            first(),
            this._log.stream('dragOutside'),
            takeUntil(this._destroyed$)
        ).subscribe(() => this._editorModal.close().subscribe(() => this._store.dispatch(new DragOutsideEditorAction())));
    }

    private _dragStart() {
        type Params = [DragManagerEvent, DragStateEnum, EntityIdType, CardEntity, boolean];
        this._dragEvents.onStart().pipe(
            withLatestFrom(
                this._store.select(DragState.state),
                this._store.select(DragState.dragId),
                this.card$,
                this._keyboard.ctrl$
            ),
            filter(([event, state]: Params) => state === DragStateEnum.SORT_ITEMS),
            this._log.stream('dragStart'),
            takeUntil(this._destroyed$)
        ).subscribe(([event, state, itemId, card, ctrl]: Params) => {
            this._store.dispatch(new DragVisibleAction('item', itemId, ctrl));
            const itemIds = [...card._item_ids];
            itemIds.splice(itemIds.indexOf(itemId), 0, null);
            this._dragItemIds$.next(itemIds);
        });
    }

    private _dragToEditor() {
        this._store.select(DragState.state).pipe(
            filter(state => state === DragStateEnum.DRAG_TO_EDITOR),
            withLatestFrom(this.card$, (state, card) => card),
            first(),
            this._log.stream('dragToEditor'),
            takeUntil(this._destroyed$)
        ).subscribe((card: CardEntity) => this._dragItemIds$.next([null, ...card._item_ids]));
    }

    private _escClose() {
        this._keyboard.esc$.pipe(
            withLatestFrom(this._store.select(DragState.isDragging)),
            filter(([esc, dragging]) => !dragging),
            first(),
            this._log.stream('dragEsc'),
            takeUntil(this._destroyed$)
        ).subscribe(() => this._editorModal.close());
    }
}
