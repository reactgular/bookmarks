import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {LoadersModule} from '../../shared/loaders/loaders.module';
import {MarkdownModule} from '../../shared/markdown/markdown.module';
import {MaterialModule} from '../../shared/material/material.module';
import {PageNotFoundModule} from '../../shared/page-not-found/page-not-found.module';
import {HelpRoutingModule} from './help-routing.module';
import {OutletFeedbackComponent} from './outlet-feedback/outlet-feedback.component';
import {OutletHelpComponent} from './outlet-help/outlet-help.component';
import { OutletTocComponent } from './outlet-toc/outlet-toc.component';

@NgModule({
    imports: [
        CommonModule,
        HelpRoutingModule,
        MaterialModule,
        MarkdownModule,
        LoadersModule,
        PageNotFoundModule
    ],
    declarations: [
        OutletHelpComponent,
        OutletFeedbackComponent,
        OutletTocComponent
    ]
})
export class HelpModule {
}
