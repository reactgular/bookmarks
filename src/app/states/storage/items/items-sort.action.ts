import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionItemIds} from '../../actions/action-item-ids';

export class ItemsSortAction implements ActionItemIds {
    public static readonly type: string = '[Items] sort';

    public constructor(public readonly item_ids: EntityIdType[]) {

    }
}
