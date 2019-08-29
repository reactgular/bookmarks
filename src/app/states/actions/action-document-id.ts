import {EntityIdType} from '../../shared/networks/networks.types';

/**
 * Represents an action that references an existing document.
 */
export interface ActionDocumentId {
    /**
     * The document ID
     */
    document_id: EntityIdType;
}
