import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MessagesModule} from '../../shared/messages/messages.module';
import {LabelsRoutingModule} from './labels-routing.module';
import {OutletLabelComponent} from './outlet-label/outlet-label.component';

@NgModule({
    imports: [
        CommonModule,
        MessagesModule,
        LabelsRoutingModule
    ],
    declarations: [
        OutletLabelComponent
    ]
})
export class LabelsModule {
}
