import {EntityId, EntityIdType, EntityTimestamp} from '../networks.types';
import {GroupResponse} from './group.entity';

/**
 * A document is a collection of grouped cards.
 */
export interface DocumentEntity extends EntityId, EntityTimestamp {
    /**
     * Documents have many groups.
     */
    _group_ids?: EntityIdType[];
    /**
     * Archived status
     */
    archived: boolean;
    /**
     * Documents belong to many labels.
     */
    label_ids: EntityIdType[];
    /**
     * The order of the documents.
     */
    order: number;
    /**
     * Title of this document.
     */
    title: string;
}

export interface DocumentContains {
    /**
     * Has many groups
     */
    groups: GroupResponse[];
}

export type DocumentResponse = DocumentEntity & DocumentContains;
