import {EntityIdType} from '../../shared/networks/networks.types';

/**
 * Represents an action that references an existing group.
 */
export interface ActionGroupId {
    /**
     * The group ID
     */
    group_id: EntityIdType;
}
