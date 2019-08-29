import {InjectionToken, OnDestroy, Type} from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {filter, map, takeUntil, withLatestFrom} from 'rxjs/operators';
import {SideBarsTokenToggleAction} from '../../states/side-bars/side-bars-token-toggle.action';
import {SideBarsState} from '../../states/side-bars/side-bars.state';
import {HotKeysService} from '../hot-keys/hot-keys/hot-keys.service';
import {ReactiveTool, ReactiveToolConfig} from './reactive-tool';
import {ReactiveToolContext} from './reactive-tool-context';

/**
 * A base class for reactive tools that open side bars.
 */
export abstract class ReactiveAutoCloseService implements OnDestroy, ReactiveTool {
    public readonly abstract config: Partial<ReactiveToolConfig>;

    protected readonly _destroyed$: Subject<void> = new Subject();

    protected constructor(protected _store: Store,
                          hotKeys: HotKeysService,
                          protected _token: InjectionToken<Type<any>>) {
        hotKeys.esc$.pipe(
            withLatestFrom(this._store.select(SideBarsState.isFirstToken).pipe(map(selector => selector(_token)))),
            filter(([a, b]) => b),
            takeUntil(this._destroyed$)
        ).subscribe(() => this.trigger());
    }

    public abstract icon(): Observable<any>;

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public abstract title(): Observable<string>;

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger(context?: ReactiveToolContext) {
        this._store.dispatch(new SideBarsTokenToggleAction(this._token));
    }
}
