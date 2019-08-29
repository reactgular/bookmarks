import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TemplatesCreatorActivate} from '../shared/templates-creator/templates-creator-activate/templates-creator-activate';
import {OutletMainComponent} from './outlet-main/outlet-main.component';
import {RouteNotFoundComponent} from './route-not-found/route-not-found.component';

const routes: Routes = [
    {
        path: '',
        component: OutletMainComponent,
        canActivate: [TemplatesCreatorActivate],
        children: [
            {
                path: '',
                loadChildren: () => import('../lazy/help/help.module').then(m => m.HelpModule)
            }, {
                path: 'bookmarks',
                loadChildren: () => import('../lazy/bookmarks/bookmarks.module').then(m => m.BookmarksModule)
            }, {
                path: 'labels',
                loadChildren: () => import('../lazy/labels/labels.module').then(m => m.LabelsModule)
            }, {
                path: 'templates',
                loadChildren: () => import('../lazy/templates/templates.module').then(m => m.TemplatesModule)
            }
        ]
    }, {
        path: '**',
        component: RouteNotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        paramsInheritanceStrategy: 'always'
    })],
    exports: [RouterModule]
})
export class MainRoutingModule {
}
