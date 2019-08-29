import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MaterialModule} from '../material/material.module';
import {LoadingBarComponent} from './loading-bar/loading-bar';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        MaterialModule
    ],
    declarations: [
        LoadingBarComponent
    ],
    exports: [
        LoadingBarComponent
    ]
})
export class NetworksModule {
}
