import {EntityIdType} from '../../shared/networks/networks.types';

export enum DragStateEnum {
    NONE = '',
    SORT_ITEMS = 'sort-items',
    SORT_CARDS = 'sort-cards',
    SORT_DOCUMENTS = 'sort-documents',
    DRAG_TO_CARD = 'drag-to-card',
    DRAG_TO_EDITOR = 'drag-to-editor'
}

export type DragType = 'item' | 'card' | 'document';

export type DragHoverType = 'card' | 'group';

export interface DragModel {
    /**
     * Not null when dragging an item.
     */
    drag_id: EntityIdType;
    /**
     * When dragging an item over top of a hover target.
     */
    hover_drag_id: EntityIdType;
    /**
     * The type of element being hovered.
     */
    hover_type: DragHoverType;
    /**
     * The current state of the drag behavior
     */
    state: DragStateEnum;
    /**
     * Type of object being dragged.
     */
    type: DragType;
}
