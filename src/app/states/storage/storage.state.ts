import {Action, Selector, State, StateContext} from '@ngxs/store';
import {CardEntity} from '../../shared/networks/entities/card.entity';
import {DocumentEntity} from '../../shared/networks/entities/document.entity';
import {EntityMap} from '../../shared/networks/entities/entity-map';
import {GroupEntity} from '../../shared/networks/entities/group.entity';
import {ItemEntity} from '../../shared/networks/entities/item.entity';
import {EntityId} from '../../shared/networks/networks.types';
import {EditorNextIds} from '../editor/editor-next-ids';
import {StorageModel} from '../models/storage-model';
import {CardsState} from './cards/cards.state';
import {DocumentsSortAction} from './documents/documents-sort.action';
import {DocumentsState} from './documents/documents.state';
import {GroupsState} from './groups/groups.state';
import {ItemsState} from './items/items.state';

type StorageContext = StateContext<StorageModel>;

@State<StorageModel>({
    name: 'storage',
    defaults: {
        archive_ids: [],
        document_ids: []
    },
    children: [
        CardsState,
        DocumentsState,
        GroupsState,
        ItemsState
    ]
})
export class StorageState {
    @Selector()
    public static archiveIds(state: StorageModel) {
        return state.archive_ids;
    }

    @Selector()
    public static documentIds(state: StorageModel) {
        return state.document_ids;
    }

    @Selector([DocumentsState, GroupsState, CardsState, ItemsState])
    public static nextIds(state: StorageModel,
                          documents: EntityMap<DocumentEntity>,
                          groups: EntityMap<GroupEntity>,
                          cards: EntityMap<CardEntity>,
                          items: EntityMap<ItemEntity>): EditorNextIds {
        function nextId(map: EntityMap<EntityId>): number {
            return Object.values(map).reduce((prev: number, item: EntityId) => Math.max(prev, <number>item.id), 0) + 1;
        }

        return {
            document_id: nextId(documents),
            group_id: nextId(groups),
            card_id: nextId(cards),
            item_id: nextId(items)
        };
    }


    @Action(DocumentsSortAction)
    public documentsSortAction({patchState}: StorageContext, {document_ids, archive_ids}: DocumentsSortAction) {
        if (document_ids) {
            patchState({document_ids});
        }
        if (archive_ids) {
            patchState({archive_ids});
        }
    }
}

