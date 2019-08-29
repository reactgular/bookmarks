import {InjectionToken} from '@angular/core';

export interface ColorPickerData {
    color: number | null;
}

export const COLOR_PICKER_DATA: InjectionToken<ColorPickerData> = new InjectionToken<ColorPickerData>('COLOR_PICKER_DATA');
