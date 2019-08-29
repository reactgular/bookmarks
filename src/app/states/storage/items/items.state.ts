import {NgZone} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {EntityMap} from '../../../shared/networks/entities/entity-map';
import {ItemEntity} from '../../../shared/networks/entities/item.entity';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {ChangesTracker} from '../../changes/changes-tracker';
import {CardsAddItemAction} from '../cards/cards-add-item.action';
import {CardsRemoveItemAction} from '../cards/cards-remove-item.action';
import {DocumentsAddAction} from '../documents/documents-add.action';
import {DragVisibleAction} from '../../editor/drag/drag-visible.action';
import {ItemsCloneAction} from './items-clone.action';
import {ItemsCreateAction} from './items-create.action';
import {ItemsDeleteAction} from './items-delete.action';
import {ItemsPatchAction} from './items-patch.action';
import {ItemsPublishAction} from './items-publish.action';
import {ItemsSortAction} from './items-sort.action';
import {ItemsUnpublishAction} from './items-unpublish.action';

type ItemsContext = StateContext<EntityMap<ItemEntity>>;

@State<EntityMap<ItemEntity>>({
    name: 'items',
    defaults: {}
})
export class ItemsState {
    private readonly _log: LogService;

    private readonly _tracker: ChangesTracker<ItemEntity>;

    public constructor(private _zone: NgZone,
                       log: LogService) {
        this._log = log.withPrefix(ItemsState.name);
        this._tracker = new ChangesTracker(this._log, true, 'items');
    }

    @Selector()
    public static byId(state: EntityMap<ItemEntity>) {
        return (id: EntityIdType) => state[id];
    }

    @Action(DragVisibleAction)
    public dragVisibleAction(ctx: ItemsContext, action: DragVisibleAction) {
        if (action.type === 'item') {
            const item = this._tracker.get(ctx, action.drag_id);
            return this._tracker.edit(ctx, {id: action.drag_id, _visible: action.visible}, !item._new);
        }
    }

    @Action(DocumentsAddAction)
    public editorDocumentAction(ctx: ItemsContext, action: DocumentsAddAction) {
        const state = {};
        action.items.forEach(item => state[item.id] = item);
        ctx.patchState(state);
    }

    @Action(ItemsCloneAction)
    public itemsCloneAction(ctx: ItemsContext, action: ItemsCloneAction) {
        const item = {...this._tracker.get(ctx, action.item_id)};
        const create = new ItemsCreateAction(this._zone, item.card_id);
        create.done$.subscribe(itemId => {
            delete item.id;
            delete item.modified;
            delete item.created;
            ctx.dispatch([
                new ItemsPatchAction(itemId, item),
                new CardsAddItemAction(item.card_id, itemId, action.item_id)
            ]).subscribe(() => action.done(itemId));
        });
        return ctx.dispatch(create);
    }

    @Action(ItemsCreateAction)
    public itemsCreateAction(ctx: ItemsContext, action: ItemsCreateAction) {
        const item: Partial<ItemEntity> = {
            _new: true,
            card_id: action.card_id,
            title: '',
            url: '',
            order: 0
        };
        const actions = [];
        actions.push(this._tracker.create(ctx, item));
        actions.push(new CardsAddItemAction(action.card_id, item.id));
        return ctx.dispatch(actions).pipe(tap(() => action.done(item.id)));
    }

    @Action(ItemsPatchAction)
    public itemsPatchAction(ctx: ItemsContext, action: ItemsPatchAction) {
        const item = this._tracker.get(ctx, action.item_id);
        return ctx.dispatch(this._tracker.edit(ctx, {id: action.item_id, ...action.item}, !item._new));
    }

    @Action(ItemsPublishAction)
    public itemsPublishAction(ctx: ItemsContext, action: ItemsPublishAction) {
        const item = this._tracker.get(ctx, action.item_id);
        return ctx.dispatch(this._tracker.publish(ctx, item.id));
    }

    @Action(ItemsDeleteAction)
    public itemsRemoveAction(ctx: ItemsContext, action: ItemsDeleteAction) {
        const item = this._tracker.get(ctx, action.item_id);
        const actions = [this._tracker.remove(ctx, action.item_id, !item._new && action.persist)];
        if (action.persist) {
            actions.push(new CardsRemoveItemAction(item.card_id, item.id));
        }
        return ctx.dispatch(actions);
    }

    @Action(ItemsSortAction)
    public itemsSortAction(ctx: ItemsContext, action: ItemsSortAction) {
        const actions = action.item_ids.map((id, order) => {
            const item = this._tracker.get(ctx, id);
            return !item._new && item.order !== order
                ? this._tracker.edit(ctx, {id, order})
                : undefined;
        }).filter(Boolean);
        if (actions.length) {
            return ctx.dispatch(actions);
        }
    }

    @Action(ItemsUnpublishAction)
    public itemsUnpublishAction(ctx: ItemsContext) {
        const actions = this._tracker.toArray(ctx)
            .filter(item => Boolean(item._new))
            .map(item => new ItemsDeleteAction(item.id));
        if (actions.length) {
            return ctx.dispatch(actions);
        }
    }
}
