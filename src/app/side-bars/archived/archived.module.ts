import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DocumentsModule as SharedDocumentsModule} from '../../shared/documents/documents.module';
import {ReactiveToolsModule} from '../../shared/reactive-tools/reactive-tools.module';
import {SideBarsModule} from '../../shared/side-bars/side-bars.module';
import {ArchivedSideBarComponent} from './archived-side-bar/archived-side-bar.component';
import {ARCHIVED_SIDE_BAR_TOKEN} from './archived-side-bar.token';

@NgModule({
    imports: [
        CommonModule,
        SharedDocumentsModule,
        ReactiveToolsModule,
        SideBarsModule
    ],
    declarations: [
        ArchivedSideBarComponent
    ],
    entryComponents: [
        ArchivedSideBarComponent
    ],
    providers: [
        {provide: ARCHIVED_SIDE_BAR_TOKEN, useValue: ArchivedSideBarComponent}
    ]
})
export class ArchivedModule {
}
