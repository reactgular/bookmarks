import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MaterialModule} from '../material/material.module';
import {PipesModule} from '../pipes/pipes.module';
import {ReactiveToolsModule} from '../reactive-tools/reactive-tools.module';
import {DocumentButtonComponent} from './document-button/document-button.component';
import {DocumentListComponent} from './document-list/document-list.component';
import {DocumentMessageComponent} from './document-message/document-message.component';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        MaterialModule,
        DragDropModule,
        RouterModule,
        ReactiveToolsModule,
        PipesModule
    ],
    declarations: [
        DocumentListComponent,
        DocumentButtonComponent,
        DocumentMessageComponent
    ],
    exports: [
        DocumentListComponent
    ]
})
export class DocumentsModule {
}
