import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionItemId} from '../../actions/action-item-id';

export class ItemsPublishAction implements ActionItemId {
    public static readonly type: string = '[Items] publish';

    public constructor(public readonly item_id: EntityIdType) {

    }
}
