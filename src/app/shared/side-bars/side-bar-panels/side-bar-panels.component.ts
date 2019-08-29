import {animate, state, style, transition, trigger} from '@angular/animations';
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Type} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {filter, map, takeUntil, withLatestFrom} from 'rxjs/operators';
import {LayoutState} from '../../../states/layout/layout.state';
import {SideBarsStateAction} from '../../../states/side-bars/side-bars-state.action';
import {SideBarsState} from '../../../states/side-bars/side-bars.state';
import {AniOpenCloseEnum} from '../../animations/animations.typets';
import {LogService} from '../../dev-tools/log/log.service';

@Component({
    selector: 'tag-side-bar-panels',
    templateUrl: './side-bar-panels.component.html',
    styleUrls: ['./side-bar-panels.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.is-overlay]': 'isOverlay',
        '[@.disabled]': 'disableAnimation',
        '[@slide]': 'slide',
        '(@slide.done)': 'animationDone($event)',
    },
    animations: [
        trigger('slide', [
            state('open', style({'transform': 'translateX(0)'})),
            state('close', style({'transform': 'translateX(-16rem)'})),
            transition('open => close', [
                style({'transform': 'translateX(0)'}),
                animate('300ms ease-in-out', style({'transform': 'translateX(-16rem)'}))
            ]),
            transition('close => open', [
                style({'transform': 'translateX(-16rem)'}),
                animate('300ms ease-in-out', style({'transform': 'translateX(0)'}))
            ])
        ])
    ]
})
export class SideBarPanelsComponent implements OnInit, OnDestroy, AfterViewInit {
    public disableAnimation: boolean = true;

    public isOverlay: boolean = false;

    public slide: string = 'open';

    @Select(SideBarsState.state)
    public state$: Observable<AniOpenCloseEnum>;

    @Select(SideBarsState.tokens)
    public tokens$: Observable<Type<any>[]>;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _el: ElementRef<HTMLElement>,
                       private _change: ChangeDetectorRef,
                       log: LogService) {
        this._log = log.withPrefix(SideBarPanelsComponent.name);
    }

    public animationDone(event: any) {
        if (event.toState === 'open') {
            this._store.dispatch(new SideBarsStateAction(AniOpenCloseEnum.OPEN));
        } else if (event.toState === 'close') {
            this._store.dispatch(new SideBarsStateAction(AniOpenCloseEnum.CLOSE));
        }
    }

    public ngAfterViewInit(): void {
        this.disableAnimation = false;
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit() {
        this.state$.pipe(
            filter(value => value === AniOpenCloseEnum.CLOSING || value === AniOpenCloseEnum.OPENING),
            map(value => value === AniOpenCloseEnum.CLOSING ? 'close' : 'open'),
            withLatestFrom(this._store.select(LayoutState.isWeb)),
            takeUntil(this._destroyed$)
        ).subscribe(([value, isWeb]: [string, boolean]) => {
            this.slide = value;
            this.isOverlay = !isWeb && value === 'open';
            this._change.markForCheck();
        });
    }
}
