import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {CardsModule} from '../cards/cards.module';
import {ColorsModule} from '../colors/colors.module';
import {ItemsModule} from '../items/items.module';
import {MaterialModule} from '../material/material.module';
import {DragCardComponent} from './drag-card/drag-card.component';
import {DragDocumentComponent} from './drag-document/drag-document.component';
import {DragHoverProgressComponent} from './drag-hover-progress/drag-hover-progress.component';
import {DragHoverDirective} from './drag-hover/drag-hover.directive';
import {DragItemComponent} from './drag-item/drag-item.component';
import {DragTargetDirective} from './drag-target/drag-target.directive';
import {DRAG_CARD_TOKEN, DRAG_DOCUMENT_TOKEN, DRAG_ITEM_TOKEN} from './drag-tokens';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CardsModule,
        ColorsModule,
        ItemsModule,
        // UiModule
    ],
    declarations: [
        DragItemComponent,
        DragCardComponent,
        DragHoverProgressComponent,
        DragHoverDirective,
        DragTargetDirective,
        DragDocumentComponent,
    ],
    providers: [
        {provide: DRAG_ITEM_TOKEN, useValue: DragItemComponent},
        {provide: DRAG_CARD_TOKEN, useValue: DragCardComponent},
        {provide: DRAG_DOCUMENT_TOKEN, useValue: DragDocumentComponent}
    ],
    exports: [
        DragHoverDirective,
        DragTargetDirective
    ],
    entryComponents: [
        DragItemComponent,
        DragCardComponent
    ]
})
export class DragModule {
}
