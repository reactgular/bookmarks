import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngxs/store';
import {Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import {LayoutChangeAction} from '../../../states/layout/layout-change.action';
import {LayoutDevice, LayoutOrientation} from '../../../states/models/layout-model';
import {distinctStringify} from '../../../utils/operators/distinct-stringify';
import {LogService} from '../log/log.service';

@Injectable({providedIn: 'root'})
export class BreakpointsService implements OnDestroy {

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _break: BreakpointObserver,
                       log: LogService) {
        this._log = log.withPrefix(BreakpointsService.name);
    }

    public initialize() {
        const breaks = [
            Breakpoints.HandsetPortrait,
            Breakpoints.TabletPortrait,
            Breakpoints.WebPortrait,
            Breakpoints.HandsetLandscape,
            Breakpoints.TabletLandscape,
            Breakpoints.WebLandscape
        ];

        this._break.observe(breaks).pipe(
            filter(values => values.matches),
            map(values => {
                if (values.breakpoints[Breakpoints.HandsetPortrait]) {
                    return ['handset', 'portrait'];
                } else if (values.breakpoints[Breakpoints.TabletPortrait]) {
                    return ['tablet', 'portrait'];
                } else if (values.breakpoints[Breakpoints.WebPortrait]) {
                    return ['web', 'portrait'];
                } else if (values.breakpoints[Breakpoints.HandsetLandscape]) {
                    return ['handset', 'landscape'];
                } else if (values.breakpoints[Breakpoints.TabletLandscape]) {
                    return ['tablet', 'landscape'];
                } else if (values.breakpoints[Breakpoints.WebLandscape]) {
                    return ['web', 'landscape'];
                }
                return undefined;
            }),
            filter(Boolean),
            distinctStringify(),
            takeUntil(this._destroyed$)
        ).subscribe(([device, orientation]: [LayoutDevice, LayoutOrientation]) => {
            this._store.dispatch(new LayoutChangeAction(device, orientation));
        });
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
