import {InjectionToken} from '@angular/core';
import {DialogRef} from './dialog-ref';

export const DIALOG_REF_TOKEN: InjectionToken<DialogRef<any, any>> = new InjectionToken<DialogRef<any, any>>('DIALOG_REF_TOKEN');
