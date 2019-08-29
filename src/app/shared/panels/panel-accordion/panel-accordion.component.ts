import {animate, AnimationEvent, state, style, transition, trigger} from '@angular/animations';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {AniOpenCloseEnum} from '../../animations/animations.typets';
import {LogService} from '../../dev-tools/log/log.service';
import {TimeoutService} from '../../dev-tools/timeout/timeout.service';

@Component({
    selector: 'tag-panel-accordion',
    templateUrl: './panel-accordion.component.html',
    styleUrls: ['./panel-accordion.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[@slide]': 'slide',
        '(@slide.start)': 'animationEvent($event)',
        '(@slide.done)': 'animationEvent($event)'
    },
    animations: [
        trigger('slide', [
            state('close', style({'height': 0})),
            state('open', style({'height': '*'})),
            transition('open => close', [
                style({height: '*'}),
                animate('300ms ease-in-out', style({height: 0}))
            ]),
            transition('close => open', [
                style({height: 0}),
                animate('300ms ease-in-out', style({height: '*'}))
            ])
        ])
    ],
    exportAs: 'panelAccordion'
})
export class PanelAccordionComponent implements OnDestroy, OnChanges {
    public addContent: boolean = false;

    @Input()
    public open: boolean = false;

    public slide: string = 'close';

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    private readonly _state$: BehaviorSubject<AniOpenCloseEnum> = new BehaviorSubject(AniOpenCloseEnum.CLOSE);

    public constructor(private _change: ChangeDetectorRef,
                       private _timeout: TimeoutService,
                       log: LogService) {
        this._log = log.withPrefix(PanelAccordionComponent.name);
    }

    @Output()
    public get state$(): Observable<AniOpenCloseEnum> {
        return this._state$.asObservable();
    }

    public animationEvent(event: AnimationEvent) {
        if (event.phaseName === 'start' && event.toState === 'open') {
            this._state$.next(AniOpenCloseEnum.OPENING);
        } else if (event.phaseName === 'done' && event.toState === 'open') {
            this._state$.next(AniOpenCloseEnum.OPEN);
        } else if (event.phaseName === 'start' && event.toState === 'close') {
            this._state$.next(AniOpenCloseEnum.CLOSING);
        } else if (event.phaseName === 'done' && event.toState === 'close') {
            this._state$.next(AniOpenCloseEnum.CLOSE);
            this.addContent = false;
            this._change.markForCheck();
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const open = changes['open'];
        if (open && open.currentValue) {
            this.addContent = true;
            this._timeout.run()
                .pipe(first(), takeUntil(this._destroyed$))
                .subscribe(() => {
                    this.slide = 'open';
                    this._change.markForCheck();
                });
        }
        if (open && !open.currentValue) {
            this.slide = 'close';
            this._change.markForCheck();
        }
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
