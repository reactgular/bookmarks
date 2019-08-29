import {Directive, ElementRef} from '@angular/core';

@Directive({
    selector: '[tagElement]',
    exportAs: 'tagElement'
})
export class ElementDirective {
    public constructor(private _el: ElementRef<HTMLElement>) {
    }

    public get ref(): ElementRef<any> {
        return this._el;
    }
}
