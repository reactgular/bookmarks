import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {faCheck, faMinus} from '@fortawesome/free-solid-svg-icons';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {distinctUntilChanged, filter, takeUntil} from 'rxjs/operators';
import {COLOR_BUTTON_DEFAULTS, ColorButton} from '../colors.types';

@Component({
    selector: 'tag-colors-picker',
    templateUrl: './colors-picker.component.html',
    styleUrls: ['./colors-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorsPickerComponent implements OnInit, OnDestroy {
    public readonly buttons$: BehaviorSubject<ColorButton[]> = new BehaviorSubject(COLOR_BUTTON_DEFAULTS);

    private readonly _color$: ReplaySubject<number | number[]> = new ReplaySubject(1);

    @Output()
    public colorChanged: Observable<number> = this._color$.pipe(
        filter<number>((value: any) => !(value instanceof Array)),
        distinctUntilChanged()
    );

    private readonly _destroyed$: Subject<void> = new Subject();

    @Input()
    public set color(value: number | number[]) {
        this._color$.next(value);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this._color$.pipe(
            distinctUntilChanged(),
            takeUntil(this._destroyed$)
        ).subscribe((value: number[]) => {
            value = Array.from(new Set(value instanceof Array ? value : [value]));
            const icon = value.length > 1 ? faMinus : faCheck;
            this.buttons$.next(COLOR_BUTTON_DEFAULTS.map(btn => value.includes(btn.color) ? ({...btn, icon}) : ({...btn})));
        });
    }
}
