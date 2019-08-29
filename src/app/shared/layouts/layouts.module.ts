import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {LayoutTileComponent} from './layout-tile/layout-tile.component';
import {LayoutTilesComponent} from './layout-tiles/layout-tiles.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        LayoutTilesComponent,
        LayoutTileComponent
    ],
    exports: [
        LayoutTilesComponent,
        LayoutTileComponent
    ]
})
export class LayoutsModule {
}
