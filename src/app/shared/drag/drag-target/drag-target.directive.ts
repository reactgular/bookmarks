import {Attribute, Directive, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {DragHoverType} from '../../../states/models/drag-model';
import {Point} from '../../../utils/shapes/point';
import {Rectangle} from '../../../utils/shapes/rectangle';
import {LogService} from '../../dev-tools/log/log.service';
import {EntityIdType} from '../../networks/networks.types';
import {DragHoverDirective} from '../drag-hover/drag-hover.directive';

@Directive({
    selector: '[tagDragTarget]'
})
export class DragTargetDirective implements OnInit, OnDestroy {
    @Input('tagDragTarget')
    public dragId: EntityIdType = null;

    private readonly _log: LogService;

    public constructor(private _dragOverDocument: DragHoverDirective,
                       @Attribute('dragType') public dragType: DragHoverType,
                       private _el: ElementRef<HTMLElement>,
                       log: LogService) {
        this._log = log.withPrefix(DragTargetDirective.name);
    }

    public intersect(p: Point): boolean {
        return Rectangle.fromRef(this._el).inside(p);
    }

    public ngOnDestroy(): void {
        this._dragOverDocument.remove(this);
    }

    public ngOnInit(): void {
        this._dragOverDocument.add(this);
    }
}
