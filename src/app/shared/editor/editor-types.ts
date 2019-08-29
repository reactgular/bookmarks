import {InjectionToken} from '@angular/core';
import {EntityIdType} from '../networks/networks.types';

export type EditorQueryPromise = (cardId: EntityIdType) => Promise<ClientRect | DOMRect>;

export interface EditorData {
    from: ClientRect | DOMRect;
    to: EditorQueryPromise;
}

/**
 * A DI Token for editor data sent to a dialog.
 */
export const EDITOR_DATA: InjectionToken<EditorData> = new InjectionToken<EditorData>('EDITOR_DATA');
