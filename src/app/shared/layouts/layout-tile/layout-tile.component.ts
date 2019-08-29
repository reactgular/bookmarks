import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {delayTime} from '../../../utils/operators/delay-time';
import {LogService} from '../../dev-tools/log/log.service';
import {WINDOW} from '../../dev-tools/window-token';
import {EntityIdType} from '../../networks/networks.types';
import {LayoutPosition} from '../layout-algorithm/layout-position';
import {LayoutTilesComponent} from '../layout-tiles/layout-tiles.component';

@Component({
    selector: 'tag-layout-tile',
    templateUrl: './layout-tile.component.html',
    styleUrls: ['./layout-tile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'layoutTile'
})
export class LayoutTileComponent implements OnDestroy, OnInit {
    private readonly _checkHeight$: EventEmitter<void> = new EventEmitter<void>(true);

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _entityId$: BehaviorSubject<EntityIdType> = new BehaviorSubject(0);

    private readonly _height$: BehaviorSubject<number> = new BehaviorSubject(0);

    private _layout: LayoutPosition;

    private readonly _log: LogService;

    private readonly _order$: BehaviorSubject<number> = new BehaviorSubject(0);

    public constructor(private _tiles: LayoutTilesComponent,
                       private _el: ElementRef<HTMLElement>,
                       @Inject(WINDOW) private _wnd: Window,
                       log: LogService) {
        this._log = log.withPrefix(LayoutTileComponent.name);
    }

    @Input()
    public set entityId(id: EntityIdType) {
        this._entityId$.next(id);
    }

    @Input()
    public set order(order: number) {
        this._order$.next(order);
    }

    public checkHeight() {
        this._checkHeight$.next();
    }

    public ngOnDestroy(): void {
        this._tiles.detach(this._layout);

        this._destroyed$.next();

        this._order$.complete();
        this._height$.complete();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {

        this._layout = new LayoutPosition(this._entityId$, this._order$, this._height$);
        this._tiles.attach(this._layout);

        const el = this._el.nativeElement;

        this._layout.width$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(width => el.style.width = `${width}px`);

        this._layout.position$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(position => {
                el.style.top = `${position.y}px`;
                el.style.left = `${position.x}px`;
                el.style.opacity = '1';
            });

        this._layout.position$.pipe(
            first(),
            delayTime(250),
            takeUntil(this._destroyed$)
        ).subscribe(() => this._wnd.setTimeout(() => el.classList.add('tile-initialized')));

        this._checkHeight$.pipe(
            takeUntil(this._destroyed$)
        ).subscribe(() => this._height$.next(this._el.nativeElement.getBoundingClientRect().height));

        this.checkHeight();
    }
}
