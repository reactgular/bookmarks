import {ComponentType} from '@angular/cdk/portal';
import {InjectionToken} from '@angular/core';

export const DRAG_ITEM_TOKEN: InjectionToken<ComponentType<any>> = new InjectionToken<ComponentType<any>>('DRAG_ITEM_TOKEN');
export const DRAG_CARD_TOKEN: InjectionToken<ComponentType<any>> = new InjectionToken<ComponentType<any>>('DRAG_CARD_TOKEN');
export const DRAG_DOCUMENT_TOKEN: InjectionToken<ComponentType<any>> = new InjectionToken<ComponentType<any>>('DRAG_DOCUMENT_TOKEN');
