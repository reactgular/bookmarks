import {ComponentType, OverlayRef} from '@angular/cdk/overlay';
import {Observable, ReplaySubject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {LogService} from '../dev-tools/log/log.service';

export class DialogRef<TComponent, TData> {

    private readonly _closed$: ReplaySubject<TData> = new ReplaySubject(1);

    private readonly _log: LogService;

    private readonly _opened$: ReplaySubject<TComponent> = new ReplaySubject(1);

    public constructor(private _overlayRef: OverlayRef,
                       public readonly component: ComponentType<TComponent>,
                       log: LogService) {
        this._log = log.withPrefix(DialogRef.name);

        _overlayRef.backdropClick()
            .pipe(takeUntil(this._closed$))
            .subscribe(() => {
                this._log.debug('_overlayRef.backdropClick');
                this.close(undefined);
            });

        this._closed$.subscribe(value => {
            this._log.debug('_closed$', value);
            this._detach();
        });
    }

    public get closed(): Observable<TData> {
        return this._closed$.pipe(first());
    }

    public get opened(): Observable<TComponent> {
        return this._opened$.pipe(first());
    }

    public close(value?: TData) {
        this._closed$.next(value);
    }

    public open(component: TComponent) {
        this._opened$.next(component);
    }

    private _detach() {
        if (this._overlayRef.hasAttached()) {
            this._log.debug('_detach');
            this._overlayRef.detach();
        }
    }
}
