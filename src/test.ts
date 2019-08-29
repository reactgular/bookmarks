// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import {HttpClientModule} from '@angular/common/http';
import {getTestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgxsModule} from '@ngxs/store';
import 'zone.js/dist/zone-testing';
import {DevToolsModule} from './app/shared/dev-tools/dev-tools.module';
import {MaterialModule} from './app/shared/material/material.module';
import {AppState} from './app/states/app/app.state';
import {CardsState} from './app/states/storage/cards/cards.state';
import {EditorState} from './app/states/editor/editor.state';
import {GroupsState} from './app/states/storage/groups/groups.state';
import {ItemsState} from './app/states/storage/items/items.state';
import {SelectionsState} from './app/states/editor/selections/selections.state';
import {LayoutState} from './app/states/layout/layout.state';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    [
        NoopAnimationsModule,
        BrowserDynamicTestingModule,
        HttpClientModule,
        DevToolsModule,
        FormsModule, // can be removed later
        ReactiveFormsModule,
        MaterialModule,
        FontAwesomeModule,
        RouterTestingModule,
        <any>NgxsModule.forRoot([
            AppState,
            LayoutState,
            CardsState,
            EditorState,
            GroupsState,
            ItemsState,
            SelectionsState
        ])
    ],
    platformBrowserDynamicTesting(),
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
