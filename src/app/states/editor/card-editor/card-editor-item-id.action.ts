import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionItemId} from '../../actions/action-item-id';

export class CardEditorItemIdAction implements ActionItemId {
    public static readonly type: string = '[CardEditor] item ID';

    public constructor(public readonly item_id: EntityIdType,
                       public readonly focusTitle: boolean = false) {

    }
}
