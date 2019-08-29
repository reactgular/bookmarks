import {Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngxs/store';
import {Subject} from 'rxjs';
import {distinctUntilChanged, filter, takeUntil} from 'rxjs/operators';
import {SelectionsState} from '../../../states/editor/selections/selections.state';
import {SideBarsTokenAddAction} from '../../../states/side-bars/side-bars-token-add.action';
import {SideBarsTokenRemoveAction} from '../../../states/side-bars/side-bars-token-remove.action';
import {SELECTION_SIDE_BAR_TOKEN} from '../selection-side-bar.token';

@Injectable()
export class SelectionMonitorService implements OnDestroy {
    private readonly _destroyed$: Subject<void> = new Subject();

    public constructor(private _store: Store) {
    }

    public initialize() {
        this._store.select(SelectionsState.someSelected).pipe(
            distinctUntilChanged(),
            filter(Boolean),
            takeUntil(this._destroyed$)
        ).subscribe(() => this._store.dispatch(new SideBarsTokenAddAction(SELECTION_SIDE_BAR_TOKEN)));

        this._store.select(SelectionsState.noneSelected).pipe(
            distinctUntilChanged(),
            filter(Boolean),
            takeUntil(this._destroyed$)
        ).subscribe(() => this._store.dispatch(new SideBarsTokenRemoveAction(SELECTION_SIDE_BAR_TOKEN)));
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
