import {CommonModule} from '@angular/common';
import {Inject, NgModule, Optional, SkipSelf} from '@angular/core';
import {ColorsModule} from '../../shared/colors/colors.module';
import {HotKeysService} from '../../shared/hot-keys/hot-keys/hot-keys.service';
import {ReactiveTool} from '../../shared/reactive-tools/reactive-tool';
import {ReactiveToolsModule} from '../../shared/reactive-tools/reactive-tools.module';
import {SideBarsModule} from '../../shared/side-bars/side-bars.module';
import {AssertLoadedOnce} from '../assert-loaded.once';
import {SelectionMonitorService} from './selection-monitor/selection-monitor.service';
import {SELECTION_SIDE_BAR_TOKEN} from './selection-side-bar.token';
import {SelectionSideBarComponent} from './selection-side-bar/selection-side-bar.component';
import {SelectionDeselectService} from './selection-tools/selection-deselect.service';
import {SELECTION_PROVIDERS, SELECTION_TOOLS} from './selection-tools/selection-providers';
import {SelectionSelectAllService} from './selection-tools/selection-select-all.service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveToolsModule,
        ColorsModule,
        SideBarsModule
    ],
    declarations: [
        SelectionSideBarComponent
    ],
    providers: [
        SelectionMonitorService,
        SelectionDeselectService,
        SelectionSelectAllService,
        ...SELECTION_PROVIDERS,
        {provide: SELECTION_SIDE_BAR_TOKEN, useValue: SelectionSideBarComponent}
    ],
    entryComponents: [
        SelectionSideBarComponent
    ]
})
export class SelectionModule {
    public constructor(@SkipSelf() @Optional() duplicate: SelectionModule,
                       hotKeys: HotKeysService,
                       monitor: SelectionMonitorService,
                       deselect: SelectionDeselectService,
                       selectAll: SelectionSelectAllService,
                       @Inject(SELECTION_TOOLS) tools: ReactiveTool[]) {
        AssertLoadedOnce(duplicate);
        hotKeys.registerMany([selectAll, deselect, ...tools]);
        monitor.initialize();
    }
}
