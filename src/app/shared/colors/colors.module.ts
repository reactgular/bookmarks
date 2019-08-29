import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MaterialModule} from '../material/material.module';
import {ColorsPickerComponent} from './colors-picker/colors-picker.component';
import {CardColorDirective} from './card-color/card-color.directive';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        MaterialModule
    ],
    declarations: [
        ColorsPickerComponent,
        CardColorDirective
    ],
    exports: [
        ColorsPickerComponent,
        CardColorDirective
    ]
})
export class ColorsModule {
}
