import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {Point} from '../../../utils/shapes/point';
import {EntityIdType} from '../../networks/networks.types';

export class LayoutPosition {
    public readonly position$: Observable<Point>;

    public readonly width$: Observable<number>;

    private readonly _position$: ReplaySubject<Point> = new ReplaySubject(1);

    private readonly _width$: ReplaySubject<number> = new ReplaySubject(1);

    public constructor(private readonly _entityId$: BehaviorSubject<EntityIdType>,
                       private readonly _order$: BehaviorSubject<number>,
                       private readonly _height$: BehaviorSubject<number>) {
        this.width$ = this._width$.pipe(distinctUntilChanged());
        this.position$ = this._position$.pipe(distinctUntilChanged((a, b) => a.x === b.x && a.y === b.y));
    }

    public getHeight(): number {
        return this._height$.getValue();
    }

    public getId(): EntityIdType {
        return this._entityId$.getValue();
    }

    public getOrder(): number {
        return this._order$.getValue();
    }

    public move(left: number, top: number, width: number) {
        this._position$.next(new Point(left, top));
        this._width$.next(width);
    }
}
