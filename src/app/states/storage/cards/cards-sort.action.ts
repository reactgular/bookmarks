import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionCardIds} from '../../actions/action-card-ids';

export class CardsSortAction implements ActionCardIds {
    public static readonly type: string = '[Cards] sort';

    public constructor(public readonly card_ids: EntityIdType[]) {

    }
}
