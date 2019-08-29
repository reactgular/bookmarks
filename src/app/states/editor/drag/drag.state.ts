import {Action, Selector, State, StateContext} from '@ngxs/store';
import {CardEntity} from '../../../shared/networks/entities/card.entity';
import {EntityMap} from '../../../shared/networks/entities/entity-map';
import {ItemEntity} from '../../../shared/networks/entities/item.entity';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {DragModel, DragStateEnum} from '../../models/drag-model';
import {CardsState} from '../../storage/cards/cards.state';
import {ItemsState} from '../../storage/items/items.state';
import {DragEndAction} from './drag-end.action';
import {DragHoverAction} from './drag-hover.action';
import {DragInsideEditorAction} from './drag-inside-editor.action';
import {DragOutsideEditorAction} from './drag-outside-editor.action';
import {DragStartAction} from './drag-start.action';
import {DragStateAction} from './drag-state.action';

type DragContext = StateContext<DragModel>;

const DEFAULT_STATE: DragModel = {
    state: null,
    type: null,
    drag_id: null,
    hover_drag_id: null,
    hover_type: null
};

@State<DragModel>({
    name: 'drag',
    defaults: DEFAULT_STATE
})
export class DragState {
    @Selector([CardsState])
    public static card(state: DragModel, cards: EntityMap<CardEntity>) {
        return state.type === 'card' ? cards[state.drag_id] : undefined;
    }

    @Selector()
    public static dragId(state: DragModel) {
        return state.drag_id;
    }

    @Selector()
    public static hoverDragId(state: DragModel) {
        return state.hover_drag_id;
    }

    @Selector()
    public static isDragToCard(state: DragModel) {
        return state.state === DragStateEnum.DRAG_TO_CARD;
    }

    @Selector()
    public static isDragging(state: DragModel) {
        return Boolean(state.state);
    }

    @Selector()
    public static isDraggingCardById(state: DragModel) {
        return (cardId: EntityIdType) => {
            return state.type === 'card' && state.state === DragStateEnum.SORT_CARDS && state.drag_id === cardId;
        };
    }

    @Selector([ItemsState])
    public static item(state: DragModel, items: EntityMap<ItemEntity>) {
        return state.type === 'item' ? items[state.drag_id] : undefined;
    }

    @Selector()
    public static itemHoverCardId(state: DragModel) {
        return state.hover_type === 'card' && state.hover_drag_id !== null && state.state === DragStateEnum.DRAG_TO_CARD
            ? state.hover_drag_id : null;
    }

    @Selector()
    public static state(state: DragModel) {
        return state.state;
    }

    @Action(DragInsideEditorAction)
    public DragInsideEditorAction(ctx: DragContext) {
        ctx.patchState({
            state: DragStateEnum.DRAG_TO_EDITOR,
            hover_drag_id: null,
            hover_type: null
        });
    }

    @Action(DragOutsideEditorAction)
    public DragOutsideEditorAction(ctx: DragContext) {
        ctx.patchState({state: DragStateEnum.DRAG_TO_CARD});
    }

    @Action(DragEndAction)
    public dragEndAction(ctx: DragContext) {
        ctx.setState(DEFAULT_STATE);
    }

    @Action(DragHoverAction)
    public dragHoverAction(ctx: DragContext, action: DragHoverAction) {
        ctx.patchState({
            hover_type: action.type,
            hover_drag_id: action.drag_id
        });
    }

    @Action(DragStartAction)
    public dragStartAction(ctx: DragContext, action: DragStartAction) {
        ctx.patchState({
            type: action.type,
            state: action.state,
            drag_id: action.drag_id
        });
    }

    @Action(DragStateAction)
    public dragStateAction(ctx: DragContext, action: DragStateAction) {
        ctx.patchState({state: action.state});
    }
}
