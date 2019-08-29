import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionCardId} from '../../actions/action-card-id';

export class DragInsideEditorAction implements ActionCardId {
    public static readonly type: string = '[Drag] inside editor';

    public constructor(public readonly card_id: EntityIdType) {

    }
}
