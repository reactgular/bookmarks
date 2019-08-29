import {ElementRef, ViewContainerRef} from '@angular/core';

export interface ReactiveToolContext {
    readonly type: 'mouse' | 'key';
    readonly when: 'down' | 'up';
}

export interface ReactiveToolMouse extends ReactiveToolContext {
    readonly el: ElementRef<HTMLElement>;
    readonly event: MouseEvent;
    readonly view: ViewContainerRef;
}

export interface ReactiveToolKeyboard extends ReactiveToolContext {
    readonly event: KeyboardEvent;
}

export function isReactiveContextMouse(value: ReactiveToolContext): value is ReactiveToolMouse {
    return value.type === 'mouse';
}

export function isReactiveContextKeyboard(value: ReactiveToolContext): value is ReactiveToolKeyboard {
    return value.type === 'key';
}
