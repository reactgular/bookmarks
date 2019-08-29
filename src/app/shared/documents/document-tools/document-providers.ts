import {InjectionToken} from '@angular/core';
import {ReactiveTool} from '../../reactive-tools/reactive-tool';
import {DocumentArchiveService} from './document-archive.service';
import {DocumentDeleteService} from './document-delete.service';
import {DocumentMoveDownService} from './document-move-down.service';
import {DocumentMoveUpService} from './document-move-up.service';

export const DOCUMENT_TOOLS: InjectionToken<ReactiveTool[]> = new InjectionToken<ReactiveTool[]>('DOCUMENT_TOOLS');

export const DOCUMENT_PROVIDERS = [
    {provide: DOCUMENT_TOOLS, useClass: DocumentMoveUpService, multi: true},
    {provide: DOCUMENT_TOOLS, useClass: DocumentMoveDownService, multi: true},
    {provide: DOCUMENT_TOOLS, useClass: DocumentArchiveService, multi: true},
    {provide: DOCUMENT_TOOLS, useClass: DocumentDeleteService, multi: true}
];

