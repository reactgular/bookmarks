import {CardEntity} from '../../../shared/networks/entities/card.entity';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionCardId} from '../../actions/action-card-id';

export class CardsPatchAction implements ActionCardId {
    public static readonly type: string = '[Cards] patch';

    public constructor(public readonly card_id: EntityIdType,
                       public readonly card: Partial<CardEntity>) {
    }
}
