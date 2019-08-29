import {EntityId} from '../networks.types';

/**
 * An object map where entities are indexed by their ID.
 */
export interface EntityMap<TType extends EntityId> {
    [id: number]: TType;
}
