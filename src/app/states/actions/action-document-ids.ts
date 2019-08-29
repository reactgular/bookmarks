import {EntityIdType} from '../../shared/networks/networks.types';

/**
 * Represents an action that references an existing documents.
 */
export interface ActionDocumentIds {
    /**
     * The document IDs
     */
    document_ids: EntityIdType[];
}
