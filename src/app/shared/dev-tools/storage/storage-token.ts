import {InjectionToken} from '@angular/core';
import {LogService} from '../log/log.service';
import {DocumentService} from './document-storage';
import {StorageService} from './storage.service';

export const LOCAL_STORAGE: InjectionToken<StorageService> = new InjectionToken<StorageService>('LOCAL_STORAGE');
export const SESSION_STORAGE: InjectionToken<StorageService> = new InjectionToken<StorageService>('SESSION_STORAGE');

export function LocalStorageFactory(document: Document, log: LogService) {
    return new DocumentService(document.defaultView.localStorage, log);
}

export function SessionStorageFactory(document: Document, log: LogService) {
    return new DocumentService(document.defaultView.sessionStorage, log);
}
