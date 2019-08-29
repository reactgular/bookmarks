import {EntityIdType} from '../../shared/networks/networks.types';

/**
 * Represents an action that references an existing card.
 */
export interface ActionCardId {
    /**
     * The card ID
     */
    card_id: EntityIdType;
}
