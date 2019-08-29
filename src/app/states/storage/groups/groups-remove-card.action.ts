import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionCardId} from '../../actions/action-card-id';
import {ActionGroupId} from '../../actions/action-group-id';

export class GroupsRemoveCardAction implements ActionGroupId, ActionCardId {
    public static readonly type: string = '[Groups] remove card';

    public constructor(public readonly group_id: EntityIdType,
                       public readonly card_id: EntityIdType) {

    }
}
