import {InjectionToken} from '@angular/core';
import {ReactiveTool} from '../../reactive-tools/reactive-tool';
import {ItemDeleteToolService} from './item-delete-tool.service';
import {ItemOpenToolService} from './item-open-tool.service';

export const ITEM_TOOL_TOKEN: InjectionToken<ReactiveTool[]> = new InjectionToken<ReactiveTool[]>('ITEM_TOOL_TOKEN');

export const ITEM_TOOL_PROVIDERS = [
    // {provide: ITEM_TOOL_TOKEN, useClass: ItemCopyToolService, multi: true},
    {provide: ITEM_TOOL_TOKEN, useClass: ItemDeleteToolService, multi: true},
    {provide: ITEM_TOOL_TOKEN, useClass: ItemOpenToolService, multi: true}
];
