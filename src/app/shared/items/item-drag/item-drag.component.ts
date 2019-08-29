import {ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {faGripVertical} from '@fortawesome/free-solid-svg-icons';
import {Select, Store} from '@ngxs/store';
import {fromEvent, merge, Observable, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {DragState} from '../../../states/editor/drag/drag.state';
import {Point} from '../../../utils/shapes/point';
import {Rectangle} from '../../../utils/shapes/rectangle';
import {LogService} from '../../dev-tools/log/log.service';
import {DragBehaviorService} from '../../drag/drag-behavior/drag-behavior.service';
import {EntityIdType} from '../../networks/networks.types';
import {ItemEditComponent} from '../item-edit/item-edit.component';

@Component({
    selector: 'tag-item-drag',
    templateUrl: './item-drag.component.html',
    styleUrls: ['./item-drag.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.drag-disabled]': 'disabled'
    }
})
export class ItemDragComponent implements OnInit, OnDestroy {
    @Input()
    public disabled: boolean;

    @Select(DragState.isDragging)
    public dragging$: Observable<boolean>;

    public iconGripVertical = faGripVertical;

    @Input()
    public itemId: EntityIdType;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _dragBehavior: DragBehaviorService,
                       private _el: ElementRef<HTMLElement>,
                       private _itemEdit: ItemEditComponent,
                       log: LogService) {
        this._log = log.withPrefix(ItemDragComponent.name);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        merge(
            fromEvent(this._el.nativeElement, 'mousedown'),
            fromEvent(this._el.nativeElement, 'touchstart')
        ).pipe(
            filter(() => !this.disabled),
            takeUntil(this._destroyed$)
        ).subscribe((event: MouseEvent & TouchEvent) => {
            event.stopPropagation();
            event.preventDefault();
            const move = Point.fromEvent(event.touches ? event.touches[0] : event);
            const offset = move.subtract(Rectangle.fromRef(this._el).grow(2).upperLeft());
            this._dragBehavior.dragItem(this.itemId, offset, move, this._itemEdit.getSize());
        });
    }
}
