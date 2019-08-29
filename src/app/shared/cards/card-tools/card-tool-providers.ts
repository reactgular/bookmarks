import {InjectionToken} from '@angular/core';
import {ReactiveTool} from '../../reactive-tools/reactive-tool';
import {CardAppendToolService} from './card-append-tool.service';
import {CardColorToolService} from './card-color-tool.service';
import {CardDeleteToolService} from './card-delete-tool.service';

export const CARD_TOOL_TOKEN: InjectionToken<ReactiveTool[]> = new InjectionToken<ReactiveTool[]>('CARD_TOOL_TOKEN');

export const CARD_TOOL_PROVIDERS = [
    {provide: CARD_TOOL_TOKEN, useClass: CardAppendToolService, multi: true},
    // {provide: CARD_TOOL_TOKEN, useClass: CardCloneToolService, multi: true},
    {provide: CARD_TOOL_TOKEN, useClass: CardColorToolService, multi: true},
    // {provide: CARD_TOOL_TOKEN, useClass: CardCopyToolService, multi: true},
    // {provide: CARD_TOOL_TOKEN, useClass: CardCutToolService, multi: true},
    {provide: CARD_TOOL_TOKEN, useClass: CardDeleteToolService, multi: true}
];
