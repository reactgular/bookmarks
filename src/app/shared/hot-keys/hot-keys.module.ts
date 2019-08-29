import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DialogsModule} from '../dialogs/dialogs.module';
import {HotKeysDialogComponent} from './hot-keys-dialog/hot-keys-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        DialogsModule
    ],
    declarations: [
        HotKeysDialogComponent
    ],
    entryComponents: [
        HotKeysDialogComponent
    ]
})
export class HotKeysModule {
}
