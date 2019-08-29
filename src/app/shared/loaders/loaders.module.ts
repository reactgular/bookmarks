import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MaterialModule} from '../material/material.module';
import {FeatureLoaderComponent} from './feature-loader/feature-loader.component';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        MaterialModule
    ],
    declarations: [
        FeatureLoaderComponent
    ],
    exports: [
        FeatureLoaderComponent
    ]
})
export class LoadersModule {
}
