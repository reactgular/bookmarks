import {InjectionToken} from '@angular/core';
import {EditorModalInterface} from './editor-modal-interface';

/**
 * Helps to resolve circular dependencies between the editor of state files.
 */
export const EDITOR_MODAL_TOKEN: InjectionToken<EditorModalInterface> =
    new InjectionToken<EditorModalInterface>('EDITOR_MODAL_TOKEN');
