import {Action, Selector, State, StateContext} from '@ngxs/store';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {DocumentEntity} from '../../../shared/networks/entities/document.entity';
import {EntityMap} from '../../../shared/networks/entities/entity-map';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {ChangesTracker} from '../../changes/changes-tracker';
import {GroupsDeleteAction} from '../groups/groups-delete.action';
import {DocumentsAddAction} from './documents-add.action';
import {DocumentsDeleteAction} from './documents-delete.action';
import {DocumentsPatchAction} from './documents-patch.action';
import {DocumentsReorderAction} from './documents-reorder.action';
import {DocumentsSetAction} from './documents-set.action';
import {DocumentsSortAction} from './documents-sort.action';
import {DocumentsTrackGroupAction} from './documents-track-group.action';

type DocumentContext = StateContext<EntityMap<DocumentEntity>>;

@State<EntityMap<DocumentEntity>>({
    name: 'documents',
    defaults: {}
})
export class DocumentsState {
    private readonly _log: LogService;

    private readonly _tracker: ChangesTracker<DocumentEntity>;

    public constructor(log: LogService) {
        this._log = log.withPrefix(DocumentsState.name);
        this._tracker = new ChangesTracker(this._log, true, 'documents');
    }

    @Selector()
    public static byId(state: EntityMap<DocumentEntity>) {
        return (id: EntityIdType) => state[id];
    }

    @Action(DocumentsAddAction)
    public documentsAddAction(ctx: DocumentContext, {document}: DocumentsAddAction) {
        this._tracker.set(ctx, document);
        return ctx.dispatch(new DocumentsReorderAction());
    }

    @Action(DocumentsDeleteAction)
    public documentsDeleteAction(ctx: DocumentContext, {document_id, persist}: DocumentsDeleteAction) {
        const document = this._tracker.get(ctx, document_id);
        return ctx.dispatch([
            this._tracker.remove(ctx, document_id, !document._new && persist),
            new DocumentsReorderAction()
        ]);
    }

    @Action(DocumentsPatchAction)
    public documentsPatchAction(ctx: DocumentContext, action: DocumentsPatchAction) {
        const document = this._tracker.get(ctx, action.document_id);
        const actions = [this._tracker.edit(ctx, {id: action.document_id, ...action.document}, !document._new)];
        if (typeof action.document.archived === 'boolean') {
            actions.push(new DocumentsReorderAction());
        }
        return ctx.dispatch(actions);
    }

    @Action(DocumentsReorderAction)
    public documentsReorderAction(ctx: DocumentContext, {persist}: DocumentsReorderAction) {
        const documents = this._tracker.toArray(ctx);
        documents.sort((a, b) => {
            if (a.order === b.order) {
                return 0;
            }
            return a.order < b.order ? -1 : 1;
        });
        const document_ids = documents.filter(doc => !doc.archived).map(doc => doc.id);
        const archive_ids = documents.filter(doc => doc.archived).map(doc => doc.id);
        return ctx.dispatch(new DocumentsSortAction(document_ids, archive_ids, persist));
    }

    @Action(DocumentsSetAction)
    public documentsSetAction(ctx: DocumentContext, {documents}: DocumentsSetAction) {
        ctx.setState(documents.reduce((curr, next) => ({...curr, [next.id]: next}), {}));
        return ctx.dispatch(new DocumentsReorderAction(false));
    }

    @Action(DocumentsSortAction)
    public documentsSortAction(ctx: DocumentContext, {document_ids, archive_ids, persist}: DocumentsSortAction) {
        const actions = [];
        [document_ids, archive_ids]
            .filter(Boolean)
            .forEach(ids => ids.forEach((id, order) => {
                const doc = this._tracker.get(ctx, id);
                if (!doc._new && doc.order !== order) {
                    actions.push(this._tracker.edit(ctx, {id, order}, persist !== false));
                }
            }));
        if (actions.length) {
            return ctx.dispatch(actions);
        }
    }

    @Action(DocumentsTrackGroupAction)
    public documentsTrackGroupAction(ctx: DocumentContext, action: DocumentsTrackGroupAction) {
        const document = this._tracker.get(ctx, action.document_id);
        return ctx.dispatch(this._tracker.edit(ctx, {id: document.id, _group_ids: [...document._group_ids, action.group_id]}));
    }

    @Action(GroupsDeleteAction)
    public groupsDeleteAction(ctx: DocumentContext, {group_id}: GroupsDeleteAction) {
        const actions = [];
        this._tracker.toArray(ctx).forEach(document => {
            if (document._group_ids && document._group_ids.includes(group_id)) {
                const groupIds = document._group_ids.filter(id => id !== group_id);
                actions.push(this._tracker.edit(ctx, {id: document.id, _group_ids: groupIds}));
            }
        });
        if (actions.length) {
            return ctx.dispatch(actions);
        }
    }
}
