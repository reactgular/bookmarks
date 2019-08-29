export enum EntityChangeEnum {
    CREATE = 'CREATE',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

/**
 * Types of entity identifiers.
 */
export type EntityIdType = number | string;

/**
 * Defines a tracking ID
 */
export interface EntityId extends Object {
    /**
     * True when entity is in the process of being created.
     */
    _new?: boolean;
    /**
     * A unique identifier that can be used in ngFor and back-end storage.
     */
    id: EntityIdType;
}

export function isEntityId(value: any): value is EntityId {
    return 'id' in value;
}

/**
 * Defines timestamps of modifications.
 */
export interface EntityTimestamp {
    /**
     * A timestamp of when the entity was created by the user.
     */
    created: string;
    /**
     * A timestamp of when it was last updated by the user.
     */
    modified: string;
}

export interface EntityVisible {
    /**
     * True to hide entity from user. Used during dragging of elements.
     */
    _visible?: Boolean;
}

/**
 * A map of entity property changes.
 */
export interface EntityChangeValue {
    [key: string]: any;
}

/**
 * Defines a change notification for the server.
 */
export interface EntityChange extends EntityId {
    /**
     * The document to modify.
     */
    document_id?: EntityIdType;
    /**
     * The resource name of the model
     */
    model: string;
    /**
     * The CRUD operation to perform on the entity.
     */
    type: EntityChangeEnum;
    /**
     * The payload for the change request. Not used for delete requests.
     */
    value?: EntityChangeValue;
}

export function isEntityTimestamp(value: any): value is EntityTimestamp {
    return 'created' in value && 'modified' in value;
}
