import {EntityId, EntityIdType, EntityTimestamp, EntityVisible} from '../networks.types';
import {ItemResponse} from './item.entity';

/**
 * The card that contains the links.
 */
export interface CardEntity extends EntityId, EntityTimestamp, EntityVisible {
    /**
     * Has many items
     */
    _item_ids?: EntityIdType[];
    /**
     * Color of the card.
     */
    color: number;
    /**
     * Belongs to a group.
     */
    group_id: EntityIdType;
    /**
     * Cards belong to many labels.
     */
    label_ids: EntityIdType[];
    /**
     * The order shown in the group.
     */
    order: number;
    /**
     * The title of this card.
     */
    title: string;
}

export interface CardContains {
    /**
     * Has many items
     */
    items: ItemResponse[];
}

export type CardResponse = CardEntity & CardContains;
