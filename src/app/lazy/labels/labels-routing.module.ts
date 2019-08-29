import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OutletLabelComponent} from './outlet-label/outlet-label.component';

const routes: Routes = [
    {
        path: ':labelId',
        component: OutletLabelComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LabelsRoutingModule {
}
