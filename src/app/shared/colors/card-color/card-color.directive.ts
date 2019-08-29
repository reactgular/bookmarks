import {Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Store} from '@ngxs/store';
import {ReplaySubject, Subject} from 'rxjs';
import {distinctUntilChanged, pairwise, startWith, takeUntil} from 'rxjs/operators';

@Directive({
    selector: '[tagCardColor]'
})
export class CardColorDirective implements OnDestroy, OnInit {
    @Input('tagColorBorder')
    public border: boolean = true;

    private _color$: ReplaySubject<number> = new ReplaySubject(1);

    private _destroyed: Subject<void> = new Subject();

    public constructor(private _store: Store,
                       private _elRef: ElementRef,
                       private _render: Renderer2) {
    }

    @Input('tagCardColor')
    public set color(value: number) {
        this._color$.next(value);
    }

    public ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }

    public ngOnInit(): void {
        this._color$.pipe(
            startWith(undefined),
            distinctUntilChanged(),
            pairwise(),
            takeUntil(this._destroyed)
        ).subscribe(([previous, next]) => {
            const el = this._elRef.nativeElement;
            if (previous !== undefined) {
                this._render.removeClass(el, `tag-card-bg-color-${previous}`);
                this._render.removeClass(el, `tag-card-border-color-${previous}`);
            }
            if (next !== undefined) {
                this._render.addClass(el, `tag-card-bg-color-${next}`);
                if (this.border) {
                    this._render.addClass(el, `tag-card-border-color-${next}`);
                }
                this._render.addClass(el, 'tag-card-color');
            } else {
                this._render.removeClass(el, 'tag-card-color');
            }
        });
    }
}
