import {CommonModule} from '@angular/common';
import {Inject, NgModule, Optional, SkipSelf} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {Store} from '@ngxs/store';
import {CardsModule} from '../../shared/cards/cards.module';
import {DocumentsModule} from '../../shared/documents/documents.module';
import {HotKeysModule} from '../../shared/hot-keys/hot-keys.module';
import {HotKeysService} from '../../shared/hot-keys/hot-keys/hot-keys.service';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ReactiveTool} from '../../shared/reactive-tools/reactive-tool';
import {ReactiveToolsModule} from '../../shared/reactive-tools/reactive-tools.module';
import {SideBarsModule} from '../../shared/side-bars/side-bars.module';
import {SideBarsTokenAddAction} from '../../states/side-bars/side-bars-token-add.action';
import {AssertLoadedOnce} from '../assert-loaded.once';
import {GeneralSearchComponent} from './general-search/general-search.component';
import {GENERAL_SIDE_BAR_TOKEN} from './general-side-bar.token';
import {GeneralSideBarComponent} from './general-side-bar/general-side-bar.component';
import {GeneralTitleComponent} from './general-title/general-title.component';
import {GeneralToolBarComponent} from './general-tool-bar/general-tool-bar.component';
import {GeneralHamburgerService} from './general-tools/general-hamburger.service';
import {GENERAL_SHORTCUT_TOOLS, GENERAL_SIDE_TOOLS, GENERAL_TOOLS_PROVIDERS, GENERAL_TOP_TOOLS} from './general-tools/general-providers';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        CardsModule,
        DocumentsModule,
        HotKeysModule,
        ReactiveToolsModule,
        SideBarsModule,
        PipesModule
    ],
    declarations: [
        GeneralSearchComponent,
        GeneralSideBarComponent,
        GeneralToolBarComponent,
        GeneralTitleComponent
    ],
    providers: [
        GeneralHamburgerService,
        ...GENERAL_TOOLS_PROVIDERS,
        {provide: GENERAL_SIDE_BAR_TOKEN, useValue: GeneralSideBarComponent}
    ],
    entryComponents: [
        GeneralSideBarComponent
    ],
    exports: [
        GeneralToolBarComponent
    ]
})
export class GeneralModule {
    public constructor(@SkipSelf() @Optional() duplicate: GeneralModule,
                       store: Store,
                       hotKeys: HotKeysService,
                       hamburger: GeneralHamburgerService,
                       @Inject(GENERAL_SIDE_TOOLS) sideTools: ReactiveTool[],
                       @Inject(GENERAL_TOP_TOOLS) topTools: ReactiveTool[],
                       @Inject(GENERAL_SHORTCUT_TOOLS) shortCuts: ReactiveTool[]) {
        AssertLoadedOnce(duplicate);
        store.dispatch(new SideBarsTokenAddAction(GENERAL_SIDE_BAR_TOKEN));
        hotKeys.registerMany([hamburger, ...sideTools, ...topTools, ...shortCuts]);
    }
}
