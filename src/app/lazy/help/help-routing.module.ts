import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OutletFeedbackComponent} from './outlet-feedback/outlet-feedback.component';
import {OutletHelpComponent} from './outlet-help/outlet-help.component';
import {OutletTocComponent} from './outlet-toc/outlet-toc.component';
import {PageResolver} from '../../shared/markdown/resolvers/page.resolver';
import {TocResolver} from '../../shared/markdown/resolvers/toc.resolver';

const routes: Routes = [
    {
        path: '',
        component: OutletTocComponent,
        resolve: {
            toc: TocResolver
        },
        children: [
            {
                path: '',
                component: OutletHelpComponent,
                resolve: {
                    page: PageResolver
                }
            }, {
                path: 'guide/:page',
                component: OutletHelpComponent,
                resolve: {
                    page: PageResolver
                }
            }
        ]
    }, {
        path: 'feedback',
        component: OutletFeedbackComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HelpRoutingModule {
}
