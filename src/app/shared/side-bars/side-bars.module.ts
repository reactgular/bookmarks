import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MaterialModule} from '../material/material.module';
import {PipesModule} from '../pipes/pipes.module';
import {ReactiveToolsModule} from '../reactive-tools/reactive-tools.module';
import {UiModule} from '../ui/ui.module';
import {SideBarComponentComponent} from './side-bar-component/side-bar-component.component';
import {SideBarHeaderComponent} from './side-bar-header/side-bar-header.component';
import {SideBarOverlayComponent} from './side-bar-overlay/side-bar-overlay.component';
import {SideBarPanelsComponent} from './side-bar-panels/side-bar-panels.component';

@NgModule({
    imports: [
        CommonModule,
        PipesModule,
        ReactiveToolsModule,
        FontAwesomeModule,
        MaterialModule,
        UiModule
    ],
    declarations: [
        SideBarComponentComponent,
        SideBarHeaderComponent,
        SideBarOverlayComponent,
        SideBarPanelsComponent
    ],
    exports: [
        SideBarHeaderComponent,
        SideBarOverlayComponent,
        SideBarPanelsComponent
    ]
})
export class SideBarsModule {
}
