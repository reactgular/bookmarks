import {EntityIdType} from '../../shared/networks/networks.types';

/**
 * Represents an action that references an existing groups.
 */
export interface ActionGroupIds {
    /**
     * The group IDs
     */
    group_ids: EntityIdType[];
}
