import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OutletTemplatesComponent} from './outlet-templates/outlet-templates.component';

const routes: Routes = [
    {
        path: '',
        component: OutletTemplatesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TemplatesRoutingModule {
}
