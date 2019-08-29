import {EntityIdType} from '../../shared/networks/networks.types';
import {ActionCardId} from '../actions/action-card-id';

export class EditorCardIdAction implements ActionCardId {
    public static readonly type: string = '[Editor] card ID';

    public constructor(public readonly card_id: EntityIdType) {

    }
}
