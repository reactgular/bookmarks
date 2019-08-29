import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ColorsModule} from '../colors/colors.module';
import {MaterialModule} from '../material/material.module';
import {PanelsModule} from '../panels/panels.module';
import {PipesModule} from '../pipes/pipes.module';
import {ReactiveToolsModule} from '../reactive-tools/reactive-tools.module';
import {UiModule} from '../ui/ui.module';
import {ItemDragComponent} from './item-drag/item-drag.component';
import {ItemEditTriggerComponent} from './item-edit-trigger/item-edit-trigger.component';
import {ItemEditComponent} from './item-edit/item-edit.component';
import {ItemFormComponent} from './item-form/item-form.component';
import {ItemImageComponent} from './item-image/item-image.component';
import {ItemViewComponent} from './item-view/item-view.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        PipesModule,
        ColorsModule,
        UiModule,
        ReactiveToolsModule,
        PanelsModule
    ],
    declarations: [
        ItemDragComponent,
        ItemEditTriggerComponent,
        ItemEditComponent,
        ItemFormComponent,
        ItemViewComponent,
        ItemImageComponent
    ],
    exports: [
        ItemDragComponent,
        ItemEditComponent,
        ItemViewComponent
    ]
})
export class ItemsModule {
}
