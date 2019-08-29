import {Subscription} from 'rxjs';
import {ReactiveTool, ReactiveToolHotKey} from '../reactive-tools/reactive-tool';

export interface HotKeySubscription {
    subscription: Subscription;
    tool: ReactiveTool & ReactiveToolHotKey;
}

export enum HotKeySectionEnum {
    GENERAL = 'general',
    SELECTION = 'selection'
}

export interface HotKeyDescription {
    /**
     * The code for the binding (i.e. CTRL+M).
     * Keys that require a shift must also bind the SHIFT key (i.e. SHIFT+?)
     */
    code: string;
    /**
     * Hides this hot key from the keyboards short cut dialog. This might be
     * done where another hot key provides a description for two keys.
     */
    hidden?: boolean;
    /**
     * Displays an alternate hot key code for the keyboards dialog.
     */
    humanCode?: string;
    /**
     * The description for the user.
     */
    message: string;
    /**
     * The section this hot key will be grouped in the keyboards dialog.
     */
    section?: HotKeySectionEnum;
}
