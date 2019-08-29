import {ItemEntity} from '../../../shared/networks/entities/item.entity';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionItemId} from '../../actions/action-item-id';

export class ItemsPatchAction implements ActionItemId {
    public static readonly type: string = '[Items] patch';

    public constructor(public readonly item_id: EntityIdType,
                       public readonly item: Partial<ItemEntity>) {
    }
}
