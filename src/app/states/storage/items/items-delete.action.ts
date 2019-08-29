import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionItemId} from '../../actions/action-item-id';

export class ItemsDeleteAction implements ActionItemId {
    public static readonly type: string = '[Items] delete';

    public constructor(public readonly item_id: EntityIdType,
                       public persist: boolean = true) {

    }
}
