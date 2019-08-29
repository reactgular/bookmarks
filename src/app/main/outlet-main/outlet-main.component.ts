import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {combineLatest, Observable, Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import {LogService} from '../../shared/dev-tools/log/log.service';
import {SelectionsClearAction} from '../../states/editor/selections/selections-clear.action';
import {SelectionsState} from '../../states/editor/selections/selections.state';
import {LayoutState} from '../../states/layout/layout.state';
import {SideBarsState} from '../../states/side-bars/side-bars.state';

@Component({
    selector: 'tag-outlet-main',
    templateUrl: './outlet-main.component.html',
    styleUrls: ['./outlet-main.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.has-indent]': 'indent'
    }
})
export class OutletMainComponent implements OnInit, OnDestroy {
    public indent: boolean = true;

    @Select(SideBarsState.showOverlay)
    public showOverlay$: Observable<boolean>;

    @Select(SelectionsState.someSelected)
    public someSelected$: Observable<boolean>;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _change: ChangeDetectorRef,
                       log: LogService) {
        this._log = log.withPrefix(OutletMainComponent.name);
    }

    public clearSelection() {
        this._store.dispatch(new SelectionsClearAction());
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        const indent$ = this._store.select(SideBarsState.state).pipe(
            filter(value => value === 'opening' || value === 'closing'),
            map(value => value === 'opening')
        );

        combineLatest([
            indent$,
            this._store.select(LayoutState.isWeb)
        ]).pipe(
            takeUntil(this._destroyed$)
        ).subscribe(([indent, isWeb]) => {
            this.indent = indent && isWeb;
            this._change.markForCheck();
        });
    }
}
