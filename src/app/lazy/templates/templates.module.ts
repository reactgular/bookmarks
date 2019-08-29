import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {LoadersModule} from '../../shared/loaders/loaders.module';
import {MaterialModule} from '../../shared/material/material.module';
import {TemplatesCreatorModule} from '../../shared/templates-creator/templates-creator.module';
import {OutletTemplatesComponent} from './outlet-templates/outlet-templates.component';
import {TemplatesRoutingModule} from './templates-routing.module';

@NgModule({
    imports: [
        CommonModule,
        TemplatesRoutingModule,
        LoadersModule,
        MaterialModule,
        TemplatesCreatorModule
    ],
    declarations: [
        OutletTemplatesComponent
    ]
})
export class TemplatesModule {
}
