import {Action, Selector, State, StateContext} from '@ngxs/store';
import {AniOpenCloseEnum} from '../../../shared/animations/animations.typets';
import {CardEntity} from '../../../shared/networks/entities/card.entity';
import {EntityMap} from '../../../shared/networks/entities/entity-map';
import {CardEditorModel} from '../../models/card-editor-model';
import {CardsPublishAction} from '../../storage/cards/cards-publish.action';
import {CardsState} from '../../storage/cards/cards.state';
import {ItemsPublishAction} from '../../storage/items/items-publish.action';
import {CardEditorCardIdAction} from './card-editor-card-id.action';
import {CardEditorItemIdAction} from './card-editor-item-id.action';
import {CardEditorPublishAction} from './card-editor-publish.action';
import {CardEditorStateAction} from './card-editor-state.action';

type CardEditorContext = StateContext<CardEditorModel>;

const DEFAULT_STATE: CardEditorModel = {
    card_id: null,
    cardFocusTitle: true,
    itemFocusTitle: true,
    item_id: null,
    editorState: AniOpenCloseEnum.CLOSE
};

@State<CardEditorModel>({
    name: 'cardEditor',
    defaults: DEFAULT_STATE
})
export class CardEditorState {
    @Selector([CardsState])
    public static card(state: CardEditorModel, cards: EntityMap<CardEntity>) {
        return cards[state.card_id];
    }

    @Selector()
    public static cardFocusTitle(state: CardEditorModel) {
        return state.cardFocusTitle;
    }

    @Selector()
    public static cardId(state: CardEditorModel) {
        return state.card_id;
    }

    @Selector()
    public static editorState(state: CardEditorModel) {
        return state.editorState;
    }

    @Selector()
    public static isCardEditorClosed(state: CardEditorModel) {
        return state.editorState === AniOpenCloseEnum.CLOSE;
    }

    @Selector()
    public static isCardEditorFullyOpen(state: CardEditorModel) {
        return state.editorState === AniOpenCloseEnum.OPEN;
    }

    @Selector()
    public static isCardEditorOpen(state: CardEditorModel) {
        return state.editorState !== AniOpenCloseEnum.CLOSE;
    }

    @Selector()
    public static isItemEditorOpen(state: CardEditorModel) {
        return state.item_id !== null;
    }

    @Selector([CardsState])
    public static isNewCard(state: CardEditorModel, cards: EntityMap<CardEntity>) {
        return state.card_id === null ? null : Boolean(cards[state.card_id]._new);
    }

    @Selector()
    public static itemFocusTitle(state: CardEditorModel) {
        return state.itemFocusTitle;
    }

    @Selector()
    public static itemId(state: CardEditorModel) {
        return state.item_id;
    }

    @Action(CardEditorCardIdAction)
    public cardEditorCardIdAction(ctx: CardEditorContext, action: CardEditorCardIdAction) {
        ctx.patchState({card_id: action.card_id});
    }

    @Action(CardEditorItemIdAction)
    public cardEditorItemIdAction(ctx: CardEditorContext, action: CardEditorItemIdAction) {
        ctx.patchState({item_id: action.item_id, itemFocusTitle: action.focusTitle});
    }

    @Action(CardEditorPublishAction)
    public cardEditorPublishAction(ctx: CardEditorContext, action: CardEditorPublishAction) {
        const state = ctx.getState();
        return ctx.dispatch([
            // @todo Publishing to the front should be configurable
            new CardsPublishAction(action.group_id, state.card_id, 'start'),
            new ItemsPublishAction(state.item_id)
        ]);
    }

    @Action(CardEditorStateAction)
    public cardEditorStateAction(ctx: CardEditorContext, action: CardEditorStateAction) {
        const patch: Partial<CardEditorModel> = action.editorState === AniOpenCloseEnum.CLOSE
            ? DEFAULT_STATE
            : {editorState: action.editorState};
        ctx.patchState(patch);
    }
}

