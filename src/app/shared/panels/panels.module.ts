import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {PanelAccordionComponent} from './panel-accordion/panel-accordion.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        PanelAccordionComponent
    ],
    exports: [
        PanelAccordionComponent
    ]
})
export class PanelsModule {
}
