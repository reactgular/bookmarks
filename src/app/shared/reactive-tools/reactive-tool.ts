import {Observable} from 'rxjs';
import {HotKeyDescription} from '../hot-keys/hot-keys.types';
import {ReactiveToolContext} from './reactive-tool-context';

export interface ReactiveToolConfig {
    /**
     * Trigger on the down context.
     */
    down: boolean;
    /**
     * The order of the tool.
     */
    order: string;
    /**
     * Trigger on the up context.
     */
    up: boolean;
}

export function reactiveConfig(tool: ReactiveTool): ReactiveToolConfig {
    const config = tool.config || {};
    const order = config.order || tool.order || '0000:0000';
    return Object.assign({
        down: true,
        up: false,
        order
    }, config);
}

export interface ReactiveTool {
    /**
     * Configuration options for the tool.
     */
    readonly config?: Partial<ReactiveToolConfig>;

    /**
     * Tools are sorted by this property.
     *
     * @deprecated Use config.order instead.
     */
    readonly order?: string;

    /**
     * The visual icon for the tool.
     */
    icon(): Observable<any>;

    /**
     * The title shown in the body of a button or menu item.
     */
    title(): Observable<string>;

    /**
     * The tooltip shown when mouse hovering.
     */
    toolTip(): Observable<string>;

    /**
     * Triggers the tool on the down event (mouse down, .
     */
    trigger(context?: ReactiveToolContext);
}

export interface ReactiveToolDisabled {
    /**
     * Emits the disabled state of a tool.
     */
    disabled(): Observable<boolean>;
}

export function isReactiveToolDisabled(value: any): value is ReactiveToolDisabled {
    return typeof (<ReactiveToolDisabled>value).disabled === 'function';
}

export interface ReactiveToolVisible {
    /**
     * Emits if the tool should be shown.
     */
    visible(): Observable<boolean>;
}

export function isReactiveToolVisible(value: any): value is ReactiveToolVisible {
    return typeof (<ReactiveToolVisible>value).visible === 'function';
}

export interface ReactiveToolAnimate {
    /**
     * Emits the animation state of the tool. Can be "spin" or "pulse" or undefined.
     */
    animate(): Observable<string>;
}

export function isReactiveToolAnimate(value: any): value is ReactiveToolAnimate {
    return typeof (<ReactiveToolAnimate>value).animate === 'function';
}

export interface ReactiveToolStyle {
    /**
     * Emits the color of the tool.
     */
    color(): Observable<'success' | 'warning' | 'danger' | 'info' | void | void>;

    /**
     * Emits when the tool is showing a modal dialog. This might indicate that other tools are inaccessible at the moment.
     */
    highlight(): Observable<boolean>;
}

export function isReactiveToolStyle(value: any): value is ReactiveToolStyle {
    return typeof (<ReactiveToolStyle>value).color === 'function'
        && typeof (<ReactiveToolStyle>value).highlight === 'function';
}

export interface ReactiveToolHotKey {
    /**
     * The hot key code. (i.e. CTRL+A)
     */
    readonly hotKey: HotKeyDescription;
}

export function isReactiveToolHotKey(value: any): value is ReactiveToolHotKey {
    return typeof (<ReactiveToolHotKey>value).hotKey === 'object';
}
