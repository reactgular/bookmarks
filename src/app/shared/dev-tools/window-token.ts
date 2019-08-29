import {InjectionToken} from '@angular/core';

/**
 * A DI Token representing the browser Window.
 */
export const WINDOW: InjectionToken<Window> = new InjectionToken<Window>('WINDOW');
