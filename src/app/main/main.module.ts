import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsRouterPluginModule} from '@ngxs/router-plugin';
import {NgxsModule} from '@ngxs/store';
// required by Material Angular
import 'hammerjs';
import {environment} from '../../environments/environment';
import {BreakpointsService} from '../shared/dev-tools/breakpoints/breakpoints.service';
import {DevToolsModule} from '../shared/dev-tools/dev-tools.module';
import {DialogsModule} from '../shared/dialogs/dialogs.module';
import {DragModule} from '../shared/drag/drag.module';
import {EditorModule} from '../shared/editor/editor.module';
import {PageNotFoundModule} from '../shared/page-not-found/page-not-found.module';
import {SideBarsModule} from '../shared/side-bars/side-bars.module';
import {TemplatesCreatorModule} from '../shared/templates-creator/templates-creator.module';
import {ArchivedModule} from '../side-bars/archived/archived.module';
import {GeneralModule} from '../side-bars/general/general.module';
import {SelectionModule} from '../side-bars/selection/selection.module';
import {AppState} from '../states/app/app.state';
import {CardEditorState} from '../states/editor/card-editor/card-editor.state';
import {DragState} from '../states/editor/drag/drag.state';
import {EditorState} from '../states/editor/editor.state';
import {SelectionsState} from '../states/editor/selections/selections.state';
import {LayoutState} from '../states/layout/layout.state';
import {SideBarsState} from '../states/side-bars/side-bars.state';
import {CardsState} from '../states/storage/cards/cards.state';
import {DocumentsState} from '../states/storage/documents/documents.state';
import {GroupsState} from '../states/storage/groups/groups.state';
import {ItemsState} from '../states/storage/items/items.state';
import {StorageState} from '../states/storage/storage.state';
import {BodyComponent} from './body/body.component';
import {MainRoutingModule} from './main-routing.module';
import {NetworkInterceptorService} from './network-interceptor/network-interceptor.service';
import {OutletMainComponent} from './outlet-main/outlet-main.component';
import {RouteNotFoundComponent} from './route-not-found/route-not-found.component';

const STATES = [
    AppState,
    CardsState,
    CardEditorState,
    DragState,
    DocumentsState,
    EditorState,
    GroupsState,
    ItemsState,
    LayoutState,
    SelectionsState,
    SideBarsState,
    StorageState
];

const SIDE_BAR_MODULES = [
    ArchivedModule,
    GeneralModule,
    SelectionModule
];

@NgModule({
    imports: [
        BrowserModule.withServerTransition({appId: 'tags'}),
        BrowserAnimationsModule,
        HttpClientModule,
        NgxsModule.forRoot(STATES, {developmentMode: !environment.production}),
        NgxsReduxDevtoolsPluginModule.forRoot({disabled: environment.production}),
        NgxsRouterPluginModule.forRoot(),
        MainRoutingModule,
        CommonModule,
        SideBarsModule,
        DevToolsModule,
        EditorModule,
        DragModule,
        DialogsModule,
        PageNotFoundModule,
        TemplatesCreatorModule,
        ...SIDE_BAR_MODULES
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: NetworkInterceptorService, multi: true},
        {provide: LOCALE_ID, useValue: 'en'}
    ],
    declarations: [
        BodyComponent,
        RouteNotFoundComponent,
        OutletMainComponent
    ],
    bootstrap: [
        BodyComponent
    ]
})
export class MainModule {
    public constructor(breakpoints: BreakpointsService) {
        breakpoints.initialize();
    }
}
