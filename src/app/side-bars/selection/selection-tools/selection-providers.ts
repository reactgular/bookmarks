import {InjectionToken} from '@angular/core';
import {ReactiveTool} from '../../../shared/reactive-tools/reactive-tool';
import {SelectionDeleteService} from './selection-delete.service';

export const SELECTION_TOOLS: InjectionToken<ReactiveTool[]> = new InjectionToken<ReactiveTool[]>('SELECTION_TOOLS');

export const SELECTION_PROVIDERS = [
    // {provide: SELECTION_TOOLS, useClass: SelectionLabelsService, multi: true},
    // {provide: SELECTION_TOOLS, useClass: SelectionCopyService, multi: true},
    // {provide: SELECTION_TOOLS, useClass: SelectionCutService, multi: true},
    // {provide: SELECTION_TOOLS, useClass: SelectionCloneService, multi: true},
    // {provide: SELECTION_TOOLS, useClass: SelectionArchiveService, multi: true},
    {provide: SELECTION_TOOLS, useClass: SelectionDeleteService, multi: true},
    // {provide: SELECTION_TOOLS, useClass: SelectionGroupService, multi: true}
];
