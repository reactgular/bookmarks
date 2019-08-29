import {EntityIdType} from '../../../shared/networks/networks.types';

export class CardsDropItemAction {
    public static readonly type: string = '[Cards] drop item';

    public constructor(public readonly source_card_id: EntityIdType,
                       public readonly target_card_id: EntityIdType,
                       public readonly source_item_id: EntityIdType,
                       public readonly item_ids: EntityIdType[],
                       public readonly clone: boolean) {

    }
}
