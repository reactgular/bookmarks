import {EntityIdType} from '../../shared/networks/networks.types';

export interface EditorModel {
    /**
     * The card that currently has focus in the document editor.
     */
    card_id: EntityIdType | null;
    /**
     * The document currently being edited.
     */
    document_id: EntityIdType | null;
    /**
     * Display the URLs for bookmarks.
     */
    show_urls: boolean;
}
