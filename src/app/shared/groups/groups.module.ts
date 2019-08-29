import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CardsModule} from '../cards/cards.module';
import {DragModule} from '../drag/drag.module';
import {LayoutsModule} from '../layouts/layouts.module';
import {MaterialModule} from '../material/material.module';
import {GroupDropItemTargetComponent} from './group-drop-item-target/group-drop-item-target.component';
import {GroupComponent} from './group/group.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CardsModule,
        DragModule,
        LayoutsModule,
        MaterialModule,
        FontAwesomeModule
    ],
    declarations: [
        GroupDropItemTargetComponent,
        GroupComponent
    ],
    exports: [
        GroupComponent
    ]
})
export class GroupsModule {
}
