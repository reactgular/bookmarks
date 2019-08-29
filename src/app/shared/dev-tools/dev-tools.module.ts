import {CommonModule, DOCUMENT} from '@angular/common';
import {NgModule, Optional} from '@angular/core';
import {LogService} from './log/log.service';
import {StackTraceService} from './stack-trace/stack-trace.service';
import {LOCAL_STORAGE, LocalStorageFactory, SESSION_STORAGE, SessionStorageFactory} from './storage/storage-token';
import {WINDOW} from './window-token';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        {provide: WINDOW, useValue: window},
        {provide: LOCAL_STORAGE, useFactory: LocalStorageFactory, deps: [[new Optional(), DOCUMENT], LogService]},
        {provide: SESSION_STORAGE, useFactory: SessionStorageFactory, deps: [[new Optional(), DOCUMENT], LogService]},
        LogService,
        StackTraceService
    ]
})
export class DevToolsModule {
}
