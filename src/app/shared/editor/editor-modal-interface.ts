import {Observable} from 'rxjs';
import {EntityIdType} from '../networks/networks.types';
import {EditorQuery} from './editor-modal/editor.query';

export interface EditorModalInterface {
    /**
     * Closes the editor.
     */
    close(): Observable<void>;

    /**
     * Opens the editor to create a new card.
     */
    create(): Promise<void>;

    /**
     * Opens the editor to edit an existing card.
     */
    edit(cardId: EntityIdType, focusTitle: boolean, itemId?: EntityIdType): Promise<void>;

    /**
     * Emits a query used to animate the open/close transition of the editor.
     */
    query(): Observable<EditorQuery>;
}
