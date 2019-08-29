import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    QueryList,
    ViewChildren
} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {fromEvent, merge, Observable, Subject} from 'rxjs';
import {distinctUntilChanged, filter, first, map, skip, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {BookmarksService} from '../../../lazy/bookmarks/bookmarks.service';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {EditorCardIdAction} from '../../../states/editor/editor-card-id.action';
import {EditorState} from '../../../states/editor/editor.state';
import {SelectionsState} from '../../../states/editor/selections/selections.state';
import {Point} from '../../../utils/shapes/point';
import {Rectangle} from '../../../utils/shapes/rectangle';
import {KeyboardService} from '../../dev-tools/keyboard/keyboard.service';
import {LogService} from '../../dev-tools/log/log.service';
import {DragBehaviorService} from '../../drag/drag-behavior/drag-behavior.service';
import {DragEventsService} from '../../drag/drag-events/drag-events.service';
import {EditorModalInterface} from '../../editor/editor-modal-interface';
import {EDITOR_MODAL_TOKEN} from '../../editor/editor-modal-token';
import {EditorQuery} from '../../editor/editor-modal/editor.query';
import {GroupComponent} from '../../groups/group/group.component';
import {ItemViewComponent} from '../../items/item-view/item-view.component';
import {LayoutTileComponent} from '../../layouts/layout-tile/layout-tile.component';
import {LayoutTilesComponent} from '../../layouts/layout-tiles/layout-tiles.component';
import {CardEntity} from '../../networks/entities/card.entity';
import {EntityId, EntityIdType} from '../../networks/networks.types';
import {ReactiveTool} from '../../reactive-tools/reactive-tool';
import {CardContext} from '../card-tools/card-context';
import {CARD_TOOL_PROVIDERS, CARD_TOOL_TOKEN} from '../card-tools/card-tool-providers';

const IGNORE_MOUSE_EVENTS = ['A', 'BUTTON', 'INPUT', 'SELECT'];

@Component({
    selector: 'tag-card-view',
    templateUrl: './card-view.component.html',
    styleUrls: ['./card-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        CardContext,
        ...CARD_TOOL_PROVIDERS
    ]
})
export class CardViewComponent implements OnInit, OnDestroy {
    public card$: Observable<CardEntity>;

    @Select(EditorState.cardId)
    public editorStateCardId$: Observable<number>;

    public isCardEdit$: Observable<boolean>;

    @ViewChildren(ItemViewComponent)
    public itemViews: QueryList<ItemViewComponent>;

    public mouseHover: boolean = false;

    @Select(SelectionsState.someSelected)
    public someSelected$: Observable<boolean>;

    private readonly _arrangeLayout$: EventEmitter<void> = new EventEmitter<void>(true);

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _el: ElementRef<HTMLElement>,
                       private _context: CardContext,
                       private _dragEvents: DragEventsService,
                       private _dragBehavior: DragBehaviorService,
                       private _bookmarks: BookmarksService,
                       @Inject(EDITOR_MODAL_TOKEN) private _editorModal: EditorModalInterface,
                       @Inject(CARD_TOOL_TOKEN) public cardTools: ReactiveTool[],
                       public keyboard: KeyboardService,
                       @Optional() private _group: GroupComponent,
                       @Optional() private _tile: LayoutTileComponent,
                       @Optional() private _tiles: LayoutTilesComponent,
                       log: LogService) {
        this._log = log.withPrefix(CardViewComponent.name);
    }

    @Input()
    public set cardId(cardId: EntityIdType) {
        this._context.setCardId(cardId);
    }

    // noinspection JSUnusedGlobalSymbols
    public entityTrackBy(indx: number, entity: EntityId): EntityIdType {
        return entity.id;
    }

    public menuClosed() {
        this._store.dispatch(new EditorCardIdAction(null));
    }

    public menuOpened() {
        this._context.getCardId()
            .pipe(first(), takeUntil(this._destroyed$))
            .subscribe(cardId => this._store.dispatch(new EditorCardIdAction(cardId)));
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        const el = this._el.nativeElement;

        this.card$ = this._context.getCard();
        this.isCardEdit$ = this._context.getCardId().pipe(
            switchMap(cardId => this._store.select(CardEditorState.cardId).pipe(map(id => id === cardId)))
        );

        this._editorModal.query().pipe(
            withLatestFrom(this._context.getCardId()),
            filter(([query, cardId]: [EditorQuery, EntityIdType]) => query.cardId === cardId),
            takeUntil(this._destroyed$)
        ).subscribe(([query, cardId]: [EditorQuery, EntityIdType]) => query.done(el.getBoundingClientRect()));

        if (this._tiles && this._tile) {
            this.card$.pipe(
                filter(Boolean),
                map((card: CardEntity) => `${Boolean(card.title)}:${card._item_ids.length}`),
                distinctUntilChanged(),
                skip(1),
                takeUntil(this._destroyed$)
            ).subscribe(() => {
                this._tile.checkHeight();
                this._arrangeLayout$.next();
            });
        }

        this._arrangeLayout$.pipe(
            takeUntil(this._destroyed$)
        ).subscribe(() => this._tiles.arrangeLayout());

        let dragging = false;

        type Params = [MouseEvent, boolean, boolean, EntityIdType];
        merge(
            fromEvent(el, 'click'),
            fromEvent(el, 'mousedown'),
            fromEvent(el, 'mouseup')
        ).pipe(
            withLatestFrom(this.keyboard.ctrl$, this._store.select(SelectionsState.someSelected), this._context.getCardId()),
            filter(([event, ctrl, someSelected]: Params) => event.target instanceof HTMLElement
                && !someSelected
                && !IGNORE_MOUSE_EVENTS.includes((<HTMLElement>event.target).tagName)
            ),
            takeUntil(this._destroyed$)
        ).subscribe(([event, ctrl, someSelected, cardId]: Params) => {
            this._log.debug(`mouse:${event.type} ctrl:${ctrl} cardId:${cardId}`, event);
            const target = <HTMLElement>event.target;
            switch (event.type) {
                case 'click':
                    if (event.button === 0) {
                        if (target.classList.contains('tag-card-title')) {
                            if (ctrl) {
                                this._bookmarks.openCard(cardId);
                            } else {
                                this._editorModal.edit(cardId, true);
                            }
                        } else {
                            const itemView = this.itemViews.find(item => item.hasChildElement(el, target));
                            if (itemView) {
                                itemView.item$
                                    .pipe(first())
                                    .subscribe(item => this._editorModal.edit(cardId, true, item.id));
                            } else {
                                this._editorModal.edit(cardId, false);
                            }
                        }
                    }
                    break;
                case 'mousedown':
                    if (event.button === 0) {
                        dragging = true;
                        const rect = Rectangle.fromRef(this._el);
                        const offset = Point.fromEvent(event).subtract(rect.grow(2).upperLeft());
                        this._dragEvents.dragDistance(Point.fromEvent(event), 10).then(dragStart => {
                            if (dragStart && dragging) {
                                const size = new Point(rect.width, rect.height);
                                this._dragBehavior.dragCard(cardId, offset, dragStart, size);
                            }
                        });
                    }
                    break;
                case 'mouseup':
                    dragging = false;
                    if (event.button === 1 && target.classList.contains('tag-card-title')) {
                        this._bookmarks.openCard(cardId);
                    }
                    break;
            }
        });
    }
}
