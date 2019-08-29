import {
    FlexibleConnectedPositionStrategy,
    HorizontalConnectionPos,
    OriginConnectionPosition,
    Overlay,
    OverlayConnectionPosition,
    OverlayRef,
    ScrollDispatcher,
    VerticalConnectionPos
} from '@angular/cdk/overlay';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {ElementRef, Injectable, Injector, ViewContainerRef} from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {finalize, map, takeUntil} from 'rxjs/operators';
import {CardsState} from '../../../states/storage/cards/cards.state';
import {KeyboardService} from '../../dev-tools/keyboard/keyboard.service';
import {LogService} from '../../dev-tools/log/log.service';
import {MaterialHacker} from '../../material/material-hacker/material.hacker';
import {CardEntity} from '../../networks/entities/card.entity';
import {EntityIdType} from '../../networks/networks.types';
import {CardColorDialogComponent, CardColorPosition} from '../card-color-dialog/card-color-dialog.component';
import {COLOR_PICKER_DATA, ColorPickerData} from '../cards-types';

@Injectable({providedIn: 'root'})
export class CardColorModalService {
    private readonly log: LogService;

    public constructor(private _store: Store,
                       private _overlay: Overlay,
                       private _scrollDispatcher: ScrollDispatcher,
                       private _injector: Injector,
                       private _keyboard: KeyboardService,
                       log: LogService) {
        this.log = log.withPrefix(CardColorModalService.name);
    }

    public open(
        selectedColor: number | null,
        elementRef: ElementRef,
        viewContainerRef: ViewContainerRef,
        position: CardColorPosition = 'above'
    ): Observable<number | null> {
        const injector = new PortalInjector(this._injector, new WeakMap([
            [COLOR_PICKER_DATA, {color: selectedColor} as ColorPickerData]
        ]));
        const overlayRef = this._createOverlay(elementRef, position);
        const portal = new ComponentPortal(CardColorDialogComponent, viewContainerRef, injector);
        const colorPickerInstance = overlayRef.attach(portal).instance;
        MaterialHacker.transparentBackdrop(overlayRef);

        const destroyed$ = new Subject();
        const color$ = new Subject<number>();

        colorPickerInstance.colorChanged.pipe(
            takeUntil(destroyed$)
        ).subscribe((color: number) => color$.next(color));

        overlayRef.backdropClick().pipe(
            takeUntil(destroyed$)
        ).subscribe(() => color$.complete());

        this._keyboard.esc$.pipe(
            takeUntil(destroyed$)
        ).subscribe(() => color$.complete());

        return color$.pipe(
            finalize(() => {
                destroyed$.next();
                destroyed$.complete();
                overlayRef.dispose();
            })
        );
    }

    /** Create the overlay config and position strategy */
    private _createOverlay(elementRef: ElementRef, position: CardColorPosition): OverlayRef {
        // Create connected position strategy that listens for scroll events to reposition.
        const strategy = this._overlay.position()
            .flexibleConnectedTo(elementRef)
            .withFlexibleDimensions(false)
            .withViewportMargin(8);

        const scrollableAncestors = this._scrollDispatcher
            .getAncestorScrollContainers(elementRef);

        strategy.withScrollableContainers(scrollableAncestors);

        const overlayRef = this._overlay.create({
            hasBackdrop: true,
            positionStrategy: strategy
        });

        this._updatePosition(overlayRef, position);

        return overlayRef;
    }

    /**
     * Returns the origin position and a fallback position based on the user's position preference.
     * The fallback position is the inverse of the origin (e.g. `'below' -> 'above'`).
     */
    private _getOrigin(position: CardColorPosition): { main: OriginConnectionPosition, fallback: OriginConnectionPosition } {
        const originPosition: OriginConnectionPosition = {originX: 'center', originY: position === 'above' ? 'top' : 'bottom'};
        const {x, y} = this._invertPosition(originPosition.originX, originPosition.originY);
        return {
            main: originPosition,
            fallback: {originX: x, originY: y}
        };
    }

    /** Returns the overlay position and a fallback position based on the user's preference */
    private _getOverlayPosition(position: CardColorPosition): { main: OverlayConnectionPosition, fallback: OverlayConnectionPosition } {
        const overlayPosition: OverlayConnectionPosition = {overlayX: 'center', overlayY: position === 'above' ? 'bottom' : 'top'};
        const {x, y} = this._invertPosition(overlayPosition.overlayX, overlayPosition.overlayY);
        return {
            main: overlayPosition,
            fallback: {overlayX: x, overlayY: y}
        };
    }

    // noinspection JSMethodCanBeStatic
    /** Inverts an overlay position. */
    private _invertPosition(x: HorizontalConnectionPos, y: VerticalConnectionPos)
        : { x: HorizontalConnectionPos, y: VerticalConnectionPos } {
        return {x, y: y === 'top' ? 'bottom' : 'top'};
    }

    /**
     * @deprecated This will need to be changed based upon multiple selections, document editor or the card editor
     */
    private _setSelected(cardId: EntityIdType, colorPickerInstance: CardColorDialogComponent) {
        // @todo This will need to be changed based upon multiple selections, document editor or the card editor
        this._store.selectOnce(CardsState.byId)
            .pipe(map(selector => selector(cardId)))
            .subscribe((card: CardEntity) => colorPickerInstance.setColor(card.color));
    }

    /** Updates the position of the current tooltip. */
    private _updatePosition(overlayRef: OverlayRef, pos: CardColorPosition) {
        const position = overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy;
        const origin = this._getOrigin(pos);
        const overlay = this._getOverlayPosition(pos);

        position.withPositions([
            {...origin.main, ...overlay.main},
            {...origin.fallback, ...overlay.fallback}
        ]);
    }
}
