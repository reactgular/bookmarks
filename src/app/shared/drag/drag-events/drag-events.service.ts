import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, OnDestroy} from '@angular/core';
import {fromEvent, merge, Observable, Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import {Point} from '../../../utils/shapes/point';
import {KeyboardService} from '../../dev-tools/keyboard/keyboard.service';
import {LogService} from '../../dev-tools/log/log.service';
import {DragManagerEvent} from '../drag-manager.event';

@Injectable({providedIn: 'root'})
export class DragEventsService implements OnDestroy {
    private readonly _body: HTMLElement;

    private readonly _destroyed$: Subject<void> = new Subject();

    private _events$: Subject<DragManagerEvent> = new Subject();

    private readonly _log: LogService;

    public constructor(private _keyboard: KeyboardService,
                       @Inject(DOCUMENT) private _doc: Document,
                       log: LogService) {
        this._log = log.withPrefix(DragEventsService.name);
        this._body = this._doc.querySelector('body');
    }

    public dragDistance(start: Point, distance: number): Promise<Point> {
        const log = this._log.withPrefix('dragDistance');
        log.debug('start');
        return new Promise(resolver => {
            const done$: Subject<Point> = new Subject();

            fromEvent(this._doc, 'mousemove').pipe(
                takeUntil(merge(done$, this._destroyed$))
            ).subscribe((event: MouseEvent) => {
                const p = Point.fromEvent(event);
                if (start.distance(p) >= distance) {
                    done$.next(p);
                }
            });

            fromEvent(this._doc, 'mouseup').pipe(
                log.stream('mouseup'),
                takeUntil(merge(done$, this._destroyed$))
            ).subscribe(() => done$.next(null));

            done$.pipe(
                log.stream('done'),
                takeUntil(this._destroyed$)
            ).subscribe(value => {
                resolver(value);
                done$.complete();
            });
        });
    }

    public events(): Observable<DragManagerEvent> {
        return this._events$.asObservable();
    }

    public ngOnDestroy(): void {
        this._events$.complete();
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public onCancel(): Observable<DragManagerEvent> {
        return this.events().pipe(filter(event => event.type === 'cancel'));
    }

    public onDrop(): Observable<DragManagerEvent> {
        return this.events().pipe(filter(event => event.type === 'drop'));
    }

    public onEnd(): Observable<DragManagerEvent> {
        return this.events().pipe(filter(event => event.type === 'end'));
    }

    public onMove(): Observable<DragManagerEvent> {
        return this.events().pipe(filter(event => event.type === 'move'));
    }

    public onStart(): Observable<DragManagerEvent> {
        return this.events().pipe(filter(event => event.type === 'start'));
    }

    public start(offset: Point, move: Point, size: Point, cursor: string = 'move') {
        this._log.debug(`start offset(${offset}) move(${move}) size(${size})`);

        this._events$.next({move, offset, size, type: 'start'});

        const previousCursor = this._setCursor(cursor);

        const done$: Subject<void> = new Subject();

        merge(fromEvent(this._doc, 'mousemove'), fromEvent(this._doc, 'touchmove')).pipe(
            map((event: any) => event.touches ? event.touches[0] : event),
            takeUntil(merge(done$, this._destroyed$))
        ).subscribe((event: MouseEvent | Touch) => {
            this._events$.next({
                offset,
                move: Point.fromEvent(event),
                size,
                type: 'move'
            });
        });

        merge(fromEvent(this._doc, 'mouseup'), fromEvent(this._doc, 'touchend')).pipe(
            this._log.stream('mouseup'),
            map((event: any) => event.touches ? event.touches[0] : event),
            takeUntil(merge(done$, this._destroyed$))
        ).subscribe((event: MouseEvent | Touch) => {
            this._events$.next({
                offset,
                move: Point.fromEvent(event),
                size,
                type: 'drop'
            });
            done$.next();
        });

        // @todo need to handle right click to cancel
        this._keyboard.esc$.pipe(
            this._log.stream('esc$'),
            takeUntil(merge(done$, this._destroyed$))
        ).subscribe(() => {
            this._events$.next({type: 'cancel'});
            done$.next();
        });

        done$.pipe(
            this._log.stream('done'),
            takeUntil(this._destroyed$)
        ).subscribe(() => {
            this._events$.next({type: 'end'});
            this._setCursor(previousCursor);
            done$.complete();
        });
    }

    private _setCursor(value: string): string {
        if (!this._body) {
            return null;
        }
        const previous = this._body.style.cursor;
        this._body.style.cursor = value;
        return previous;
    }
}
