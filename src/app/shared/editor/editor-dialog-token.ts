import {ComponentType} from '@angular/cdk/portal';
import {InjectionToken} from '@angular/core';
import {EditorDialogClosable} from './editor-dialog-closable';

/**
 * Helps to resolve circular dependencies between the editor of state files.
 */
export const EDITOR_DIALOG_TOKEN: InjectionToken<ComponentType<EditorDialogClosable>> =
    new InjectionToken<ComponentType<EditorDialogClosable>>('EDITOR_DIALOG_TOKEN');
