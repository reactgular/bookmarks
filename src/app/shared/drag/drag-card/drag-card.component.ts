import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {concat, Observable, race, Subject} from 'rxjs';
import {delay, first, takeUntil} from 'rxjs/operators';
import {DragState} from '../../../states/editor/drag/drag.state';
import {Point} from '../../../utils/shapes/point';
import {LogService} from '../../dev-tools/log/log.service';
import {EntityIdType} from '../../networks/networks.types';
import {DragEventsService} from '../drag-events/drag-events.service';
import {DragManagerEvent} from '../drag-manager.event';

@Component({
    selector: 'tag-drag-card',
    templateUrl: './drag-card.component.html',
    styleUrls: ['./drag-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragCardComponent implements OnInit, OnDestroy {
    @Select(DragState.dragId)
    public cardId$: Observable<EntityIdType>;

    public position: Point;

    public width: number;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _dragEvents: DragEventsService,
                       private _change: ChangeDetectorRef,
                       log: LogService) {
        this._log = log.withPrefix(DragCardComponent.name);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit() {
        const delaysStartEvent$ = concat(this._dragEvents.onStart().pipe(first(), delay(100)), this._dragEvents.onMove());
        const firstEmittedStream$ = race(delaysStartEvent$, this._dragEvents.onMove());
        firstEmittedStream$.pipe(
            takeUntil(this._destroyed$)
        ).subscribe((event: DragManagerEvent) => {
            this.position = event.move.subtract(event.offset);
            this.width = event.size.x;
            this._change.markForCheck();
        });
    }
}
