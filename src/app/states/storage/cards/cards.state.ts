import {NgZone} from '@angular/core';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {CardEntity} from '../../../shared/networks/entities/card.entity';
import {EntityMap} from '../../../shared/networks/entities/entity-map';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {AppSequenceAction} from '../../app/app-sequence.action';
import {ChangesTracker} from '../../changes/changes-tracker';
import {DocumentsAddAction} from '../documents/documents-add.action';
import {DragVisibleAction} from '../../editor/drag/drag-visible.action';
import {GroupsAddCardAction} from '../groups/groups-add-card.action';
import {GroupsRemoveCardAction} from '../groups/groups-remove-card.action';
import {ItemsCloneAction} from '../items/items-clone.action';
import {ItemsDeleteAction} from '../items/items-delete.action';
import {ItemsPatchAction} from '../items/items-patch.action';
import {ItemsPublishAction} from '../items/items-publish.action';
import {ItemsSortAction} from '../items/items-sort.action';
import {CardsAddItemAction} from './cards-add-item.action';
import {CardsCloneAction} from './cards-clone.action';
import {CardsCreateAction} from './cards-create.action';
import {CardsDeleteAction} from './cards-delete.action';
import {CardsDropItemAction} from './cards-drop-item.action';
import {CardsPatchAction} from './cards-patch.action';
import {CardsPublishAction} from './cards-publish.action';
import {CardsRemoveItemAction} from './cards-remove-item.action';
import {CardsReorderItemsAction} from './cards-reorder-items.action';
import {CardsSortAction} from './cards-sort.action';
import {CardsUnpublishAction} from './cards-unpublish.action';

type CardsContext = StateContext<EntityMap<CardEntity>>;

@State<EntityMap<CardEntity>>({
    name: 'cards',
    defaults: {}
})
export class CardsState {
    private readonly _log: LogService;

    private readonly _tracker: ChangesTracker<CardEntity>;

    public constructor(private _store: Store,
                       private _zone: NgZone,
                       log: LogService) {
        this._log = log.withPrefix(CardsState.name);
        this._tracker = new ChangesTracker(this._log, true, 'cards');
    }

    @Selector()
    public static byId(state: EntityMap<CardEntity>) {
        return (id: EntityIdType) => state[id];
    }

    @Action(CardsCloneAction)
    public cardsCloneAction(ctx: CardsContext, action: CardsCloneAction) {
        const actions = [];
        action.card_ids.forEach((cardId) => {
            const card = this._tracker.clone(ctx, cardId);
            card.id = undefined;
            actions.push(this._tracker.create(ctx, card));
            actions.push(new GroupsAddCardAction(card.group_id, card.id, cardId));
        });
        return ctx.dispatch(actions);
    }

    @Action(CardsCreateAction)
    public cardsCreateAction(ctx: CardsContext, action: CardsCreateAction) {
        const card: Partial<CardEntity> = {
            _new: true,
            color: 0,
            order: 0,
            title: '',
            group_id: 0,
            _item_ids: []
        };
        return ctx.dispatch(this._tracker.create(ctx, card))
            .pipe(tap(() => action.done(card.id)));
    }

    @Action(CardsDeleteAction)
    public cardsDeleteAction(ctx: CardsContext, action: CardsDeleteAction) {
        const card = this._tracker.get(ctx, action.card_id);
        const actions: any[] = card._item_ids.map(itemId => new ItemsDeleteAction(itemId, false));
        if (card.group_id !== 0 && action.persist) {
            actions.push(new GroupsRemoveCardAction(card.group_id, action.card_id));
        }
        actions.push(this._tracker.remove(ctx, action.card_id, !card._new && action.persist));
        return ctx.dispatch(actions);
    }

    @Action(CardsDropItemAction)
    public cardsDropItemAction(ctx: CardsContext, action: CardsDropItemAction) {
        this._cloneAsPromise(action.source_item_id, action.clone).then(newItemId => {
            const actions: any[] = [];
            if (action.source_card_id !== action.target_card_id || action.clone) {
                actions.push(new CardsRemoveItemAction(action.source_card_id, newItemId));
                actions.push(new CardsAddItemAction(action.target_card_id, newItemId));
                actions.push(new ItemsPatchAction(newItemId, {card_id: action.target_card_id}));
            }
            const itemIds = action.clone
                ? action.item_ids
                : action.item_ids.filter(id => id !== action.source_item_id);
            const indexOfNull = itemIds.indexOf(null);
            if (indexOfNull === -1) {
                itemIds.push(newItemId);
            } else {
                itemIds.splice(itemIds.indexOf(null), 1, newItemId);
            }
            actions.push(new CardsReorderItemsAction(action.target_card_id, itemIds));
            if (action.clone) {
                actions.push(new ItemsPublishAction(newItemId));
            }
            this._store.dispatch(new AppSequenceAction(actions));
        });
    }

    @Action(CardsPatchAction)
    public cardsPatchAction(ctx: CardsContext, action: CardsPatchAction) {
        const card = this._tracker.get(ctx, action.card_id);
        return ctx.dispatch(this._tracker.edit(ctx, {id: action.card_id, ...action.card}, !card._new));
    }

    @Action(CardsPublishAction)
    public cardsPublishAction(ctx: CardsContext, action: CardsPublishAction) {
        const card = {...this._tracker.get(ctx, action.card_id)};
        if (!card._new) {
            return;
        }
        if (card.group_id) {
            throw new Error(`card:${action.card_id} already assigned to group:${card.group_id}`);
        }
        card.group_id = action.group_id;
        this._tracker.set(ctx, card);
        return ctx.dispatch([
            this._tracker.publish(ctx, action.card_id),
            new GroupsAddCardAction(card.group_id, card.id, action.position)
        ]);
    }

    @Action(CardsRemoveItemAction)
    public cardsRemoveItemAction(ctx: CardsContext, action: CardsRemoveItemAction) {
        const card = this._tracker.get(ctx, action.card_id);
        const _item_ids = card._item_ids.filter(itemId => itemId !== action.item_id);
        return ctx.dispatch(this._tracker.edit(ctx, {id: action.card_id, _item_ids}, !card._new));
    }

    @Action(CardsReorderItemsAction)
    public cardsReorderItemAction(ctx: CardsContext, action: CardsReorderItemsAction) {
        const card = this._tracker.get(ctx, action.card_id);
        return ctx.dispatch([
            new ItemsSortAction(action.item_ids),
            this._tracker.edit(ctx, {id: action.card_id, _item_ids: action.item_ids}, !card._new)
        ]);
    }

    @Action(CardsSortAction)
    public cardsSortAction(ctx: CardsContext, action: CardsSortAction) {
        const actions = action.card_ids.map((id, order) => {
            const card = this._tracker.get(ctx, id);
            return !card._new && card.order !== order
                ? this._tracker.edit(ctx, {id, order})
                : undefined;
        }).filter(Boolean);
        if (actions.length) {
            return ctx.dispatch(actions);
        }
    }

    @Action(CardsAddItemAction)
    public cardsTrackItemAction(ctx: CardsContext, action: CardsAddItemAction) {
        const card = this._tracker.get(ctx, action.card_id);
        const patch: Partial<CardEntity> = {id: action.card_id};
        if (action.after_item_id) {
            patch._item_ids = [...card._item_ids];
            patch._item_ids.splice(patch._item_ids.indexOf(action.after_item_id), 0, action.item_id);
        } else {
            patch._item_ids = [...card._item_ids, action.item_id];
        }
        return ctx.dispatch(this._tracker.edit(ctx, patch, !card._new));
    }

    @Action(CardsUnpublishAction)
    public cardsUnpublishAction(ctx: CardsContext) {
        const actions = this._tracker.toArray(ctx)
            .filter(card => Boolean(card._new))
            .map(card => new CardsDeleteAction(card.id));
        if (actions.length) {
            return ctx.dispatch(actions);
        }
    }

    @Action(DragVisibleAction)
    public dragVisibleAction(ctx: CardsContext, action: DragVisibleAction) {
        if (action.type === 'card') {
            const card = this._tracker.get(ctx, action.drag_id);
            return this._tracker.edit(ctx, {id: action.drag_id, _visible: action.visible}, !card._new);
        }
    }

    @Action(DocumentsAddAction)
    public editorDocumentAction(ctx: CardsContext, action: DocumentsAddAction) {
        const state = action.cards.reduce((current, card) => ({...current, [card.id]: card}), {});
        ctx.patchState(state);
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
}
