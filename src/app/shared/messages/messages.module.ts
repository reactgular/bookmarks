import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MessageBigIconComponent} from './message-big-icon/message-big-icon.component';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule
    ],
    declarations: [
        MessageBigIconComponent
    ],
    exports: [
        MessageBigIconComponent
    ]
})
export class MessagesModule {
}
