import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {interval, Observable, Subject} from 'rxjs';
import {map, takeUntil, takeWhile} from 'rxjs/operators';
import {DragInsideEditorAction} from '../../../states/editor/drag/drag-inside-editor.action';
import {DragState} from '../../../states/editor/drag/drag.state';
import {LogService} from '../../dev-tools/log/log.service';
import {WINDOW} from '../../dev-tools/window-token';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-drag-hover-progress',
    templateUrl: './drag-hover-progress.component.html',
    styleUrls: ['./drag-hover-progress.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragHoverProgressComponent implements OnDestroy, OnInit {
    @Input()
    public radius: number = 50;

    @Input()
    public thick: number = 10;

    public timer: number = null;

    public value$: Observable<number>;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _change: ChangeDetectorRef,
                       private _zone: NgZone,
                       @Inject(WINDOW) private _wnd: Window,
                       log: LogService) {
        this._log = log.withPrefix(DragHoverProgressComponent.name);
    }

    public ngOnDestroy(): void {
        this._stopTimer();
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this._store.select(DragState.itemHoverCardId).pipe(
            takeUntil(this._destroyed$)
        ).subscribe((dragId: EntityIdType) => {
            if (dragId !== null) {
                this._startTimer(dragId);
            } else {
                if (this._stopTimer()) {
                    this._change.markForCheck();
                }
            }
        });
    }

    private _cardTrigger(cardId: EntityIdType) {
        this._store.dispatch(new DragInsideEditorAction(cardId));
    }

    private _startTimer(cardId: EntityIdType) {
        this._stopTimer();
        this.value$ = interval(100).pipe(
            map(value => value * 10),
            takeWhile(value => value <= 120)
        );
        this.timer = this._wnd.setTimeout(() => this._store.dispatch(new DragInsideEditorAction(cardId)), 1350);
        this._change.markForCheck();
    }

    private _stopTimer(): boolean {
        if (this.timer === null) {
            return false;
        }
        this._wnd.clearTimeout(this.timer);
        this.timer = null;
        return true;
    }
}
