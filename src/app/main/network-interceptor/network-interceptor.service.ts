import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngxs/store';
import {combineLatest, Observable, Subject} from 'rxjs';
import {distinctUntilChanged, finalize, map, scan, takeUntil} from 'rxjs/operators';
import {LogService} from '../../shared/dev-tools/log/log.service';
import {AppNetworkAction} from '../../states/app/app-network.action';

@Injectable()
export class NetworkInterceptorService implements HttpInterceptor, OnDestroy {
    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    private readonly _read$: Subject<boolean> = new Subject();

    private readonly _write$: Subject<boolean> = new Subject();

    public constructor(private _store: Store,
                       log: LogService) {
        this._log = log.withPrefix(NetworkInterceptorService.name);

        combineLatest([
            NetworkInterceptorService._activeState(this._read$),
            NetworkInterceptorService._activeState(this._write$)
        ]).pipe(
            takeUntil(this._destroyed$)
        ).subscribe(([read, write]) => this._store.dispatch(new AppNetworkAction(read, write)));
    }

    private static _activeState(events: Observable<boolean>) {
        return events.pipe(
            scan((count: number, busy: boolean) => busy ? count + 1 : count - 1, 0),
            map(count => count > 0),
            distinctUntilChanged()
        );
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const events = (req.method === 'GET' || req.method === 'HEAD') ? this._read$ : this._write$;
        events.next(true);
        return next.handle(req).pipe(finalize(() => events.next(false)));
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
