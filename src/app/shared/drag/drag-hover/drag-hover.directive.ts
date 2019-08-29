import {Directive, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {Subject} from 'rxjs';
import {filter, takeUntil, withLatestFrom} from 'rxjs/operators';
import {DragHoverAction} from '../../../states/editor/drag/drag-hover.action';
import {DragState} from '../../../states/editor/drag/drag.state';
import {DragModel, DragStateEnum} from '../../../states/models/drag-model';
import {LogService} from '../../dev-tools/log/log.service';
import {DragEventsService} from '../drag-events/drag-events.service';
import {DragManagerEvent} from '../drag-manager.event';
import {DragTargetDirective} from '../drag-target/drag-target.directive';

@Directive({
    selector: '[tagDragHover]'
})
export class DragHoverDirective implements OnDestroy, OnInit {

    private _cardTargets: DragTargetDirective[] = [];

    private readonly _destroyed$: Subject<void> = new Subject();

    private _groupTargets: DragTargetDirective[] = [];

    private readonly _hoverActions$: Subject<DragHoverAction> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _dragEvents: DragEventsService,
                       log: LogService) {
        this._log = log.withPrefix(DragHoverDirective.name);
    }

    public add(target: DragTargetDirective) {
        if (target.dragType === 'card') {
            this._cardTargets.push(target);
        } else if (target.dragType === 'group') {
            this._groupTargets.push(target);
        }
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        const STATES = [DragStateEnum.DRAG_TO_CARD, DragStateEnum.SORT_CARDS];
        this._dragEvents.onMove().pipe(
            withLatestFrom(this._store.select(DragState)),
            filter(([event, dragState]: [DragManagerEvent, DragModel]) => STATES.includes(dragState.state)),
            takeUntil(this._destroyed$)
        ).subscribe(([event, dragState]: [DragManagerEvent, DragModel]) => {
            if (dragState.state === DragStateEnum.DRAG_TO_CARD) {
                this._handleDraggingItem(event, dragState);
            } else if (dragState.state === DragStateEnum.SORT_CARDS) {
                this._handleDraggingCard(event, dragState);
            }
        });

        // Dispatches changes in the hover state only when something new has been hovered
        this._hoverActions$.pipe(
            withLatestFrom(this._store.select(DragState)),
            filter(([action, dragState]: [DragHoverAction, DragModel]) =>
                dragState.hover_type !== action.type || dragState.hover_drag_id !== action.drag_id
            ),
            takeUntil(this._destroyed$)
        ).subscribe(([action, dragState]: [DragHoverAction, DragModel]) => this._store.dispatch(action));
    }

    public remove(target: DragTargetDirective) {
        if (target.dragType === 'card') {
            this._cardTargets = this._cardTargets.filter(card => card !== target);
        } else if (target.dragType === 'group') {
            this._groupTargets = this._groupTargets.filter(group => group !== target);
        }
    }

    private _handleDraggingCard(event: DragManagerEvent, dragState: DragModel) {
        const targets = [...this._cardTargets, ...this._groupTargets];
        const target: DragTargetDirective = this._cardTargets.find((t: DragTargetDirective) => t.intersect(event.move));
        if (target) {

        } else {
            this._hoverActions$.next(new DragHoverAction(null, null));
        }
    }

    private _handleDraggingItem(event: DragManagerEvent, dragState: DragModel) {
        const target: DragTargetDirective = this._cardTargets.find((t: DragTargetDirective) => t.intersect(event.move));
        if (target) {
            this._hoverActions$.next(new DragHoverAction(target.dragType, target.dragId));
        } else {
            this._hoverActions$.next(new DragHoverAction(null, null));
        }
    }
}
