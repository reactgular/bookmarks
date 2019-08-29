import {InjectionToken} from '@angular/core';
import {ReactiveTool} from '../../../shared/reactive-tools/reactive-tool';
import {GeneralAppDownloadService} from './general-app-download.service';
import {GeneralArchivedService} from './general-archived.service';
import {GeneralHelpService} from './general-help.service';
import {GeneralKeyboardShortcutsService} from './general-keyboard-shortcuts.service';
import {GeneralRedoService} from './general-redo.service';
import {GeneralSearchService} from './general-search.service';
import {GeneralSendFeedbackService} from './general-send-feedback.service';
import {GeneralSettingsService} from './general-settings.service';
import {GeneralShowUrlsService} from './general-show-urls.service';
import {GeneralTemplatesService} from './general-templates.service';
import {GeneralTrashService} from './general-trash.service';
import {GeneralUndoService} from './general-undo.service';

export const GENERAL_SIDE_TOOLS: InjectionToken<ReactiveTool[]> = new InjectionToken<ReactiveTool[]>('GENERAL_SIDE_TOOLS');

export const GENERAL_TOP_TOOLS: InjectionToken<ReactiveTool[]> = new InjectionToken<ReactiveTool[]>('GENERAL_TOP_TOOLS');

export const GENERAL_SHORTCUT_TOOLS: InjectionToken<ReactiveTool[]> = new InjectionToken<ReactiveTool[]>('GENERAL_SHORTCUT_TOOLS');

export const GENERAL_TOOLS_PROVIDERS = [
    {provide: GENERAL_SIDE_TOOLS, useClass: GeneralTemplatesService, multi: true},
    {provide: GENERAL_SIDE_TOOLS, useClass: GeneralArchivedService, multi: true},
    {provide: GENERAL_SIDE_TOOLS, useClass: GeneralTrashService, multi: true},
    {provide: GENERAL_SIDE_TOOLS, useClass: GeneralSendFeedbackService, multi: true},
    {provide: GENERAL_SIDE_TOOLS, useClass: GeneralHelpService, multi: true},
    {provide: GENERAL_SIDE_TOOLS, useClass: GeneralAppDownloadService, multi: true},
    {provide: GENERAL_SIDE_TOOLS, useClass: GeneralKeyboardShortcutsService, multi: true},
    {provide: GENERAL_TOP_TOOLS, useClass: GeneralSearchService, multi: true},
    {provide: GENERAL_TOP_TOOLS, useClass: GeneralSettingsService, multi: true},
    {provide: GENERAL_TOP_TOOLS, useClass: GeneralUndoService, multi: true},
    {provide: GENERAL_TOP_TOOLS, useClass: GeneralRedoService, multi: true},
    {provide: GENERAL_SHORTCUT_TOOLS, useClass: GeneralShowUrlsService, multi: true},
    // {provide: GENERAL_SHORTCUT_TOOLS, useClass: GeneralPasteService, multi: true}
];
