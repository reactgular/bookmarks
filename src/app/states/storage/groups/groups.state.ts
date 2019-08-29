import {NgZone} from '@angular/core';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {map, switchMap, tap} from 'rxjs/operators';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {CardEntity} from '../../../shared/networks/entities/card.entity';
import {EntityMap} from '../../../shared/networks/entities/entity-map';
import {GroupEntity} from '../../../shared/networks/entities/group.entity';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {AppSequenceAction} from '../../app/app-sequence.action';
import {ChangesTracker} from '../../changes/changes-tracker';
import {CardEditorPublishAction} from '../../editor/card-editor/card-editor-publish.action';
import {CardsDeleteAction} from '../cards/cards-delete.action';
import {CardsSortAction} from '../cards/cards-sort.action';
import {CardsState} from '../cards/cards.state';
import {DocumentsAddAction} from '../documents/documents-add.action';
import {DocumentsTrackGroupAction} from '../documents/documents-track-group.action';
import {GroupsAddCardAction} from './groups-add-card.action';
import {GroupsCreateAction} from './groups-create.action';
import {GroupsDeleteCardAction} from './groups-delete-card.action';
import {GroupsDeleteEmptyAction} from './groups-delete-empty.action';
import {GroupsDeleteAction} from './groups-delete.action';
import {GroupsPatchAction} from './groups-patch.action';
import {GroupsPublishAction} from './groups-publish.action';
import {GroupsRemoveCardAction} from './groups-remove-card.action';
import {GroupsReorderCardsAction} from './groups-reorder-cards.action';
import {GroupsUnpublishAction} from './groups-unpublish.action';

type GroupsContext = StateContext<EntityMap<GroupEntity>>;

@State<EntityMap<GroupEntity>>({
    name: 'groups',
    defaults: {}
})
export class GroupsState {
    private readonly _log: LogService;

    private readonly _tracker: ChangesTracker<GroupEntity>;

    public constructor(private _store: Store,
                       private _zone: NgZone,
                       log: LogService) {
        this._log = log.withPrefix(GroupsState.name);
        this._tracker = new ChangesTracker(this._log, true, 'groups');
    }

    @Selector()
    public static byDocumentId(state: EntityMap<GroupEntity>) {
        return (documentId: EntityIdType) => Object.values(state).filter((group: GroupEntity) => group.document_id === documentId);
    }

    @Selector()
    public static byId(state: EntityMap<GroupEntity>) {
        return (id: EntityIdType) => state[id];
    }

    @Action(DocumentsAddAction)
    public editorDocumentAction(ctx: GroupsContext, action: DocumentsAddAction) {
        const state = {};
        action.groups.forEach(group => state[group.id] = group);
        ctx.patchState(state);
    }

    @Action(GroupsAddCardAction)
    public groupsAddCardAction(ctx: GroupsContext, action: GroupsAddCardAction) {
        const group = this._tracker.get(ctx, action.group_id);
        let _cardIds = group._card_ids.slice();
        if (action.position === 'start') {
            _cardIds.unshift(action.card_id);
        } else if (action.position === 'end') {
            _cardIds.push(action.card_id);
        } else {
            const afterIndx = _cardIds.indexOf(action.position);
            if (afterIndx === -1) {
                throw new Error('after card not found');
            }
            const before = _cardIds.slice(0, afterIndx + 1);
            const after = _cardIds.slice(afterIndx + 1);
            _cardIds = before.concat(action.card_id, after);
        }
        return ctx.dispatch(new AppSequenceAction([
            this._tracker.edit(ctx, {id: group.id, _card_ids: _cardIds}),
            new GroupsReorderCardsAction(group.id, _cardIds)
        ]));
    }

    @Action(GroupsCreateAction)
    public groupsCreateAction(ctx: GroupsContext, action: GroupsCreateAction) {
        const group: Partial<GroupEntity> = {
            document_id: action.document_id,
            _card_ids: [],
            title: '',
            order: 0
        };
        return ctx.dispatch([
            this._tracker.create(ctx, group),
            new DocumentsTrackGroupAction(action.document_id, group.id)
        ]).pipe(tap(() => action.done(group.id)));
    }

    @Action(GroupsDeleteAction)
    public groupsDeleteAction(ctx: GroupsContext, action: GroupsDeleteAction) {
        const group = this._tracker.get(ctx, action.group_id);
        return ctx.dispatch([
            ...group._card_ids.map(cardId => new CardsDeleteAction(cardId, false)),
            this._tracker.remove(ctx, action.group_id, !group._new)
        ]);
    }

    @Action(GroupsDeleteCardAction)
    public groupsDeleteCardAction(ctx: GroupsContext, action: GroupsDeleteCardAction) {
        return this._store.selectOnce(CardsState.byId)
            .pipe(
                map(selector => selector(action.card_id)),
                switchMap((card: CardEntity) => {
                    const group = this._tracker.get(ctx, card.group_id);
                    if (group._card_ids.length === 1) {
                        return ctx.dispatch(new GroupsDeleteAction(card.group_id));
                    }
                    return ctx.dispatch(new CardsDeleteAction(action.card_id));
                })
            );
    }

    @Action(GroupsDeleteEmptyAction)
    public groupsDeleteEmptyAction(ctx: GroupsContext) {
        const actions = this._tracker.toArray(ctx)
            .filter(group => group._card_ids.length === 0)
            .map(group => new GroupsDeleteAction(group.id));
        if (actions.length) {
            return ctx.dispatch(actions);
        }
    }

    @Action(GroupsPatchAction)
    public groupsPatchAction(ctx: GroupsContext, action: GroupsPatchAction) {
        return ctx.dispatch(this._tracker.edit(ctx, {id: action.group_id, ...action.group}));
    }

    @Action(GroupsPublishAction)
    public groupsPublishAction(ctx: GroupsContext, action: GroupsPublishAction) {
        const state = ctx.getState();
        const groups: GroupEntity[] = Object.values(ctx.getState())
            .filter((group: GroupEntity) => group.document_id === action.document_id);
        if (groups.length) {
            const group = this._tracker.get(ctx, groups[0].id);
            return ctx.dispatch(new CardEditorPublishAction(action.document_id, group.id));
        }

        const createGroup = new GroupsCreateAction(this._zone);
        createGroup.document_id = action.document_id;
        createGroup.done$.subscribe(groupId => {
            this._store.dispatch(new CardEditorPublishAction(action.document_id, groupId));
        });
        return ctx.dispatch(createGroup);
    }

    @Action(GroupsRemoveCardAction)
    public groupsRemoveCardAction(ctx: GroupsContext, action: GroupsRemoveCardAction) {
        const group = this._tracker.get(ctx, action.group_id);
        const _card_ids = group._card_ids.filter(cardId => cardId !== action.card_id);
        return ctx.dispatch(this._tracker.edit(ctx, {id: action.group_id, _card_ids}, !group._new));
    }

    @Action(GroupsReorderCardsAction)
    public groupsReorderCardsAction(ctx: GroupsContext, action: GroupsReorderCardsAction) {
        const group = this._tracker.get(ctx, action.group_id);
        return ctx.dispatch([
            new CardsSortAction(action.card_ids),
            this._tracker.edit(ctx, {id: action.group_id, _card_ids: action.card_ids}, !group._new)
        ]);
    }

    @Action(GroupsUnpublishAction)
    public groupsUnpublishAction(ctx: GroupsContext) {
        const actions = this._tracker.toArray(ctx)
            .filter(group => Boolean(group._new))
            .map(group => new GroupsDeleteAction(group.id));
        if (actions.length) {
            return ctx.dispatch(actions);
        }
    }
}
