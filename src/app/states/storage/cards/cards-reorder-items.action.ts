import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionCardId} from '../../actions/action-card-id';
import {ActionItemIds} from '../../actions/action-item-ids';

export class CardsReorderItemsAction implements ActionCardId, ActionItemIds {
    public static readonly type: string = '[Cards] reorder items';

    public constructor(public readonly card_id: EntityIdType,
                       public readonly item_ids: EntityIdType[]) {

    }
}
