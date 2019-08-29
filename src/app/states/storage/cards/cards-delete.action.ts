import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionCardId} from '../../actions/action-card-id';

export class CardsDeleteAction implements ActionCardId {
    public static readonly type: string = '[Cards] delete';

    public constructor(public readonly card_id: EntityIdType,
                       public readonly persist: boolean = true) {

    }
}
