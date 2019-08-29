import {EntityIdType} from '../../shared/networks/networks.types';

/**
 * Represents an action that references an many existing card.
 */
export interface ActionCardIds {
    /**
     * The card IDs
     */
    card_ids: EntityIdType[];
}
