import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
    selector: '[tagScrollTop]'
})
export class ScrollTopDirective {
    public constructor(private _elRef: ElementRef<HTMLElement>) {

    }

    @Input('tagScrollTop')
    public set scrollTop(value: number) {
        if (typeof this._elRef.nativeElement.scrollTop !== 'undefined') {
            this._elRef.nativeElement.scrollTop = value;
        }
    }
}
