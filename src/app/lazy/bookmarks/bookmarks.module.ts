import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {DragModule} from '../../shared/drag/drag.module';
import {GroupsModule} from '../../shared/groups/groups.module';
import {LoadersModule} from '../../shared/loaders/loaders.module';
import {MessagesModule} from '../../shared/messages/messages.module';
import {BookmarksRoutingModule} from './bookmarks-routing.module';
import {OutletEditorComponent} from './outlet-editor/outlet-editor.component';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        BookmarksRoutingModule,
        DragModule,
        GroupsModule,
        LoadersModule,
        MessagesModule
    ],
    declarations: [
        OutletEditorComponent
    ]
})
export class BookmarksModule {
}
