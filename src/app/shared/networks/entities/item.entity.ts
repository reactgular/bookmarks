import {EntityId, EntityIdType, EntityTimestamp, EntityVisible} from '../networks.types';

/**
 * Describes an item that is shown on a card. Such as a bookmark or link to a document.
 */
export interface ItemEntity extends EntityId, EntityTimestamp, EntityVisible {
    /**
     * Belongs to a card.
     */
    card_id: EntityIdType;
    /**
     * URL to the favorite icon for this item.
     */
    image?: string;
    /**
     * The order of the item in the card.
     */
    order: number;
    /**
     * The title of the item. Ignored if documentId is set.
     */
    title: string;
    /**
     * The URL for this item. Ignored if documentId is set.
     */
    url: string;
}

export type ItemResponse = ItemEntity;
