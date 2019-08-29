import {ChangeDetectionStrategy, Component, ElementRef, Inject, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {BehaviorSubject, combineLatest, fromEvent, merge, ReplaySubject, Subject} from 'rxjs';
import {distinctUntilChanged, first, map, takeUntil, throttleTime, withLatestFrom} from 'rxjs/operators';
import {LayoutState} from '../../../states/layout/layout.state';
import {SideBarsState} from '../../../states/side-bars/side-bars.state';
import {distinctStringify} from '../../../utils/operators/distinct-stringify';
import {Rectangle} from '../../../utils/shapes/rectangle';
import {LogService} from '../../dev-tools/log/log.service';
import {WINDOW} from '../../dev-tools/window-token';
import {LayoutAlgorithm} from '../layout-algorithm/layout-algorithm';
import {LayoutPosition} from '../layout-algorithm/layout-position';
import {LayoutSnapshot} from '../layout-algorithm/layout-snapshot';

function sortPositions(positions: LayoutPosition[]): LayoutPosition[] {
    const sorted = [...positions];
    sorted.sort((a: LayoutPosition, b: LayoutPosition) => {
        const x = a.getOrder(), y = b.getOrder();
        return x === y ? 0 : (x > y ? 1 : -1);
    });
    return sorted;
}

@Component({
    selector: 'tag-layout-tiles',
    templateUrl: './layout-tiles.component.html',
    styleUrls: ['./layout-tiles.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutTilesComponent implements OnDestroy, OnInit {
    /**
     * Emits when the input binding changes the width of a single column.
     */
    private readonly _columnWidth$: BehaviorSubject<number> = new BehaviorSubject(300);

    /**
     * Emits every time the layout of the tiles needs to be recalculated.
     */
    private readonly _columns$: ReplaySubject<LayoutAlgorithm> = new ReplaySubject(1);

    /**
     * Emits when the tiles component is destroyed
     */
    private readonly _destroyed$: Subject<void> = new Subject();

    /**
     * Emits when the input binding changes the width of the gutters between columns.
     */
    private readonly _gutter$: BehaviorSubject<number> = new BehaviorSubject(18);

    /**
     * Emits when the height of the tiles has changed.
     */
    private readonly _height$: ReplaySubject<number> = new ReplaySubject(1);

    /**
     * The logger
     */
    private readonly _log: LogService;

    /**
     * Emits when a tile is attached or detached
     */
    private readonly _positions$: BehaviorSubject<LayoutPosition[]> = new BehaviorSubject([]);

    /**
     * Emits when width of the tiles component changes
     */
    private readonly _width$: BehaviorSubject<number> = new BehaviorSubject(0);

    public constructor(private _store: Store,
                       private _el: ElementRef<HTMLElement>,
                       private _zone: NgZone,
                       @Inject(WINDOW) private _wnd: Window,
                       log: LogService) {
        this._log = log.withPrefix(LayoutTilesComponent.name);
    }

    @Input()
    public set columnWidth(columnWidth: number) {
        this._columnWidth$.next(columnWidth);
    }

    @Input()
    public set gutter(gutter: number) {
        this._gutter$.next(gutter);
    }

    public arrangeLayout(): Promise<LayoutSnapshot[]> {
        return new Promise(resolver => {
            this._columns$.pipe(
                first(),
                withLatestFrom(this._positions$),
                takeUntil(this._destroyed$)
            ).subscribe(([columns, positions]: [LayoutAlgorithm, LayoutPosition[]]) => {
                const offset = Rectangle.fromRef(this._el).upperLeft();
                const constraint = columns.constraint(offset);
                sortPositions(positions).forEach(position => constraint.move(position));
                this._height$.next(constraint.height);
                resolver(constraint.snapshots);
            });
        });
    }

    public attach(position: LayoutPosition): LayoutPosition {
        this._positions$
            .pipe(first())
            .subscribe(positions => this._positions$.next([...positions, position]));
        return position;
    }

    public detach(position: LayoutPosition) {
        this._positions$
            .pipe(first())
            .subscribe(positions => this._positions$.next(positions.filter(p => p !== position)));
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        merge(
            this._store.select(SideBarsState.layoutChanged),
            this._store.select(LayoutState.deviceOrientation).pipe(distinctStringify()),
            fromEvent(this._wnd, 'resize')
        ).pipe(
            takeUntil(this._destroyed$)
        ).subscribe(() => this._width());

        combineLatest([
            this._width$.pipe(
                distinctUntilChanged(),
                throttleTime(250, undefined, {leading: true, trailing: true})
            ),
            this._columnWidth$.pipe(distinctUntilChanged()),
            this._gutter$.pipe(distinctUntilChanged())
        ]).pipe(
            takeUntil(this._destroyed$)
        ).subscribe(([width, columnWidth, gutter]: [number, number, number]) => {
            this._columns$.next(new LayoutAlgorithm(width, columnWidth, gutter));
        });

        this._columns$.pipe(
            map(columns => JSON.stringify(columns.toString())),
            distinctUntilChanged(),
            takeUntil(this._destroyed$)
        ).subscribe(() => this.arrangeLayout());

        this._height$.pipe(
            distinctUntilChanged(),
            takeUntil(this._destroyed$)
        ).subscribe((height: number) => this._el.nativeElement.style.height = `${height}px`);

        this._width();
    }

    private _width() {
        this._zone.onStable
            .pipe(first(), takeUntil(this._destroyed$))
            .subscribe(() => this._width$.next(this._el.nativeElement.getBoundingClientRect().width));
    }
}
