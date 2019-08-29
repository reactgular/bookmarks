import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MaterialModule} from '../material/material.module';
import {UiModule} from '../ui/ui.module';
import {ReactiveMoreComponent} from './reactive-more/reactive-more.component';
import {ReactiveOrderPipe} from './reactive-order/reactive-order.pipe';
import {ReactiveRibbonComponent} from './reactive-ribbon/reactive-ribbon.component';
import {ReactiveSideBarComponent} from './reactive-side-bar/reactive-side-bar.component';
import {ReactiveToolComponent} from './reactive-tool/reactive-tool.component';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        MaterialModule,
        UiModule
    ],
    declarations: [
        ReactiveMoreComponent,
        ReactiveOrderPipe,
        ReactiveRibbonComponent,
        ReactiveSideBarComponent,
        ReactiveToolComponent
    ],
    providers: [
        ReactiveOrderPipe
    ],
    exports: [
        ReactiveMoreComponent,
        ReactiveRibbonComponent,
        ReactiveSideBarComponent,
        ReactiveToolComponent
    ]
})
export class ReactiveToolsModule {
}
