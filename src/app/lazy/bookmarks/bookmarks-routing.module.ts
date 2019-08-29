import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeactivateEditor} from './deactivate-editor.service';
import {OutletEditorComponent} from './outlet-editor/outlet-editor.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/'
    }, {
        path: ':documentId',
        component: OutletEditorComponent,
        canDeactivate: [
            DeactivateEditor
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookmarksRoutingModule {
}
