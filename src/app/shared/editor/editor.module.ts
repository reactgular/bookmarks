import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {CardsModule} from '../cards/cards.module';
import {ColorsModule} from '../colors/colors.module';
import {EditorColorBgComponent} from './editor-color-bg/editor-color-bg.component';
import {EDITOR_DIALOG_TOKEN} from './editor-dialog-token';
import {EditorDialogComponent} from './editor-dialog/editor-dialog.component';
import {EDITOR_MODAL_TOKEN} from './editor-modal-token';
import {EditorModalService} from './editor-modal/editor-modal.service';
import {EditorScaleComponent} from './editor-scale/editor-scale.component';

@NgModule({
    imports: [
        CommonModule,
        CardsModule,
        ColorsModule
        // UiModule
    ],
    declarations: [
        EditorColorBgComponent,
        EditorDialogComponent,
        EditorScaleComponent
    ],
    providers: [
        {provide: EDITOR_DIALOG_TOKEN, useValue: EditorDialogComponent},
        {provide: EDITOR_MODAL_TOKEN, useClass: EditorModalService}
    ],
    entryComponents: [
        EditorDialogComponent
    ]
})
export class EditorModule {
}
