import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MaterialModule} from '../material/material.module';
import {PipesModule} from '../pipes/pipes.module';
import {ElementDirective} from './element/element.directive';
import {ScrollTopDirective} from './scroll-top/scroll-top.directive';
import {ComponentCreatorDirective} from './component-creator/component-creator.directive';
import {TimestampComponent} from './timestamp/timestamp.component';

@NgModule({
    imports: [
        CommonModule,
        PipesModule,
        MaterialModule
    ],
    declarations: [
        ElementDirective,
        ScrollTopDirective,
        ComponentCreatorDirective,
        TimestampComponent
    ],
    exports: [
        ElementDirective,
        ScrollTopDirective,
        ComponentCreatorDirective,
        TimestampComponent
    ]
})
export class UiModule {
}
