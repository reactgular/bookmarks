import {EntityId, EntityIdType, EntityTimestamp} from '../networks.types';

export interface LabelEntity extends EntityId, EntityTimestamp {
    /**
     * Labels belong to many documents.
     */
    _document_ids?: EntityIdType[];
    /**
     * Color of the label.
     */
    color: number;
    /**
     * The title of the label.
     */
    title: string;
}
