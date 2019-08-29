import {Injectable, OnDestroy} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {Actions, ofActionDispatched, Store} from '@ngxs/store';
import {merge, Observable, of, Subject} from 'rxjs';
import {filter, takeUntil, withLatestFrom} from 'rxjs/operators';
import {HotKeyDescription, HotKeySectionEnum} from '../../../shared/hot-keys/hot-keys.types';
import {HotKeysService} from '../../../shared/hot-keys/hot-keys/hot-keys.service';
import {ReactiveTool, ReactiveToolDisabled, ReactiveToolHotKey} from '../../../shared/reactive-tools/reactive-tool';
import {SelectionsClearAction} from '../../../states/editor/selections/selections-clear.action';
import {SelectionsState} from '../../../states/editor/selections/selections.state';
import {SideBarsHeaderCloseAction} from '../../../states/side-bars/side-bars-header-close.action';

@Injectable()
export class SelectionDeselectService implements ReactiveTool, ReactiveToolDisabled, ReactiveToolHotKey, OnDestroy {
    public readonly hotKey: HotKeyDescription = {
        code: 'CTRL+ALT+A',
        humanCode: 'ESC',
        message: 'Deselects all cards',
        section: HotKeySectionEnum.SELECTION
    };

    public readonly order: string = 'main:deselect';

    private readonly _destroyed$: Subject<void> = new Subject();

    public constructor(private _store: Store,
                       private _actions$: Actions,
                       hotKey: HotKeysService) {

        const esc$ = hotKey.esc$.pipe(
            withLatestFrom(this._store.select(SelectionsState.someSelected), (a, b) => b),
            filter(Boolean)
        );

        const close$ = this._actions$.pipe(
            ofActionDispatched(SideBarsHeaderCloseAction)
        );

        merge(esc$, close$).pipe(
            takeUntil(this._destroyed$)
        ).subscribe(() => this.trigger());
    }

    public disabled(): Observable<boolean> {
        return this._store.select(SelectionsState.noneSelected);
    }

    public icon(): Observable<any> {
        return of(faTimes);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public title(): Observable<string> {
        return of('Deselect');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
        this._store.dispatch(new SelectionsClearAction());
    }
}
