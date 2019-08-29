import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionCardId} from '../../actions/action-card-id';

export class SelectionsToggleAction implements ActionCardId {
    public static readonly type: string = '[Selections] toggle';

    public constructor(public readonly card_id: EntityIdType) {

    }
}
