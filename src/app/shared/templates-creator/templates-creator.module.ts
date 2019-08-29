import {TitleCasePipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {TemplatesCreatorActivate} from './templates-creator-activate/templates-creator-activate';
import {TemplatesService} from './templates/templates.service';

@NgModule({
    providers: [
        TemplatesCreatorActivate,
        TemplatesService,
        {provide: TitleCasePipe, useClass: TitleCasePipe},
    ]
})
export class TemplatesCreatorModule {
}
