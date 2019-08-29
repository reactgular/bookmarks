import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MaterialModule} from '../material/material.module';
import {UiModule} from '../ui/ui.module';
import {DialogConfirmComponent} from './dialog-confirm/dialog-confirm.component';
import {DialogHeaderComponent} from './dialog-header/dialog-header.component';
import {ModalDialogComponent} from './modal-dialog/modal-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        MaterialModule,
        UiModule
    ],
    declarations: [
        DialogConfirmComponent,
        DialogHeaderComponent,
        ModalDialogComponent
    ],
    entryComponents: [
        DialogConfirmComponent,
        ModalDialogComponent
    ],
    exports: [
        DialogHeaderComponent
    ]
})
export class DialogsModule {
}
