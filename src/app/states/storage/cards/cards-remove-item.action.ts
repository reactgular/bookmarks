import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionCardId} from '../../actions/action-card-id';
import {ActionItemId} from '../../actions/action-item-id';

export class CardsRemoveItemAction implements ActionCardId, ActionItemId {
    public static readonly type: string = '[Cards] remove item';

    public constructor(public readonly card_id: EntityIdType,
                       public readonly item_id: EntityIdType) {

    }
}
