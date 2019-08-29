import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionGroupId} from '../../actions/action-group-id';

export class GroupsDeleteAction implements ActionGroupId {
    public static readonly type: string = '[Groups] delete';

    public constructor(public readonly group_id: EntityIdType) {

    }
}
