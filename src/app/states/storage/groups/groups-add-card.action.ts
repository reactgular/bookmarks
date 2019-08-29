import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionCardId} from '../../actions/action-card-id';
import {ActionGroupId} from '../../actions/action-group-id';

export type GroupsAddCardPosition = EntityIdType | 'start' | 'end';

export class GroupsAddCardAction implements ActionGroupId, ActionCardId {
    public static readonly type: string = '[Groups] add card';

    public constructor(
        public readonly group_id: EntityIdType,
        public readonly card_id: EntityIdType,
        public readonly position: GroupsAddCardPosition
    ) {

    }
}
