import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionCardIds} from '../../actions/action-card-ids';
import {ActionGroupId} from '../../actions/action-group-id';

export class GroupsReorderCardsAction implements ActionGroupId, ActionCardIds {
    public static readonly type: string = '[Groups] reorder cards';

    public constructor(public readonly group_id: EntityIdType,
                       public readonly card_ids: EntityIdType[]) {

    }
}
