import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionCardId} from '../../actions/action-card-id';
import {ActionGroupId} from '../../actions/action-group-id';
import {GroupsAddCardPosition} from '../groups/groups-add-card.action';

export class CardsPublishAction implements ActionGroupId, ActionCardId {
    public static readonly type: string = '[Cards] publish';

    public constructor(public readonly group_id: EntityIdType,
                       public readonly card_id: EntityIdType,
                       public readonly position: GroupsAddCardPosition) {

    }
}
