import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ColorsModule} from '../colors/colors.module';
import {ItemsModule} from '../items/items.module';
import {MaterialModule} from '../material/material.module';
import {ReactiveToolsModule} from '../reactive-tools/reactive-tools.module';
import {UiModule} from '../ui/ui.module';
import {CardColorDialogComponent} from './card-color-dialog/card-color-dialog.component';
import {CardCreateButtonComponent} from './card-create-button/card-create-button.component';
import {CardCreateTextComponent} from './card-create-text/card-create-text.component';
import {CardDragItemsComponent} from './card-drag-items/card-drag-items.component';
import {CardEditComponent} from './card-edit/card-edit.component';
import {CardEmptyComponent} from './card-empty/card-empty.component';
import {CardOutlineComponent} from './card-outline/card-outline.component';
import {CardSelectComponent} from './card-select/card-select.component';
import {CardViewComponent} from './card-view/card-view.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        ColorsModule,
        ItemsModule,
        MaterialModule,
        ReactiveToolsModule,
        UiModule
    ],
    declarations: [
        CardColorDialogComponent,
        CardCreateButtonComponent,
        CardCreateTextComponent,
        CardEditComponent,
        CardEmptyComponent,
        CardOutlineComponent,
        CardSelectComponent,
        CardViewComponent,
        CardDragItemsComponent
    ],
    exports: [
        CardCreateButtonComponent,
        CardCreateTextComponent,
        CardEditComponent,
        CardOutlineComponent,
        CardViewComponent
    ],
    entryComponents: [
        CardColorDialogComponent
    ]
})
export class CardsModule {
}
