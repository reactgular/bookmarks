import {EntityId, EntityIdType, EntityTimestamp} from '../networks.types';
import {CardEntity} from './card.entity';

/**
 * A group holds a collection of cards, and a group is owned by a document.
 */
export interface GroupEntity extends EntityId, EntityTimestamp {
    /**
     * Has many cards
     */
    _card_ids?: EntityIdType[];
    /**
     * Belongs to a document.
     */
    document_id: EntityIdType;
    /**
     * The order shown in the document.
     */
    order: number;
    /**
     * Title of the group.
     */
    title: string;
}

export interface GroupContains {
    /**
     * Has many cards
     */
    cards: CardEntity[];
}

export type GroupResponse = GroupEntity & GroupContains;
