import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionCardIds} from '../../actions/action-card-ids';

export class CardsCloneAction implements ActionCardIds {
    public static readonly type: string = '[Cards] clone';

    public constructor(public readonly card_ids: EntityIdType[]) {

    }
}
