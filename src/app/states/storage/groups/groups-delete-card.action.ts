import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionCardId} from '../../actions/action-card-id';

export class GroupsDeleteCardAction implements ActionCardId {
    public static readonly type: string = '[Groups] delete card';

    public constructor(public readonly card_id: EntityIdType) {

    }
}
