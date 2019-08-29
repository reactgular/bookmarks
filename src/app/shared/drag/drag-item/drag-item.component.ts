import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {merge, Observable, Subject} from 'rxjs';
import {distinctUntilChanged, map, takeUntil} from 'rxjs/operators';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {DragState} from '../../../states/editor/drag/drag.state';
import {Point} from '../../../utils/shapes/point';
import {LogService} from '../../dev-tools/log/log.service';
import {EntityIdType} from '../../networks/networks.types';
import {DragEventsService} from '../drag-events/drag-events.service';
import {DragManagerEvent} from '../drag-manager.event';

@Component({
    selector: 'tag-drag-item',
    templateUrl: './drag-item.component.html',
    styleUrls: ['./drag-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragItemComponent implements OnInit, OnDestroy {
    public cardColor$: Observable<number>;

    @Select(DragState.dragId)
    public itemId$: Observable<EntityIdType>;

    public offset: Point;

    public position: Point;

    public radius: number = 25;

    public width: number;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _dragEvents: DragEventsService,
                       private _change: ChangeDetectorRef,
                       log: LogService) {
        this._log = log.withPrefix(DragItemComponent.name);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        merge(this._dragEvents.onStart(), this._dragEvents.onMove()).pipe(
            takeUntil(this._destroyed$)
        ).subscribe((event: DragManagerEvent) => {
            this.position = event.move.subtract(event.offset);
            this.offset = event.offset;
            this.width = event.size.x;
            this._change.markForCheck();
        });
        this.cardColor$ = this._store.select(CardEditorState.card).pipe(map(card => card ? card.color : 0), distinctUntilChanged());
    }
}
