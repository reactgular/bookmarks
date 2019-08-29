import {EntityChange, EntityIdType} from '../../shared/networks/networks.types';

export interface ChangesModel {
    /**
     * The current document.
     */
    document_id: EntityIdType;
    /**
     * Indicates a failure to save changes and if the changes can be retried.
     */
    error: 'fatal' | 'retry';
    /**
     * Changes awaiting to be sent to the server.
     */
    queued: EntityChange[];
    /**
     * Changes currently being sent to the server.
     */
    sending: EntityChange[];
}
