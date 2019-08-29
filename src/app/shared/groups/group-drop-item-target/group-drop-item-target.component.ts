import {animate, style, transition, trigger} from '@angular/animations';
import {ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {filter, map, takeUntil, withLatestFrom} from 'rxjs/operators';
import {AppSequenceAction} from '../../../states/app/app-sequence.action';
import {CardsCreateAction} from '../../../states/storage/cards/cards-create.action';
import {CardsDropItemAction} from '../../../states/storage/cards/cards-drop-item.action';
import {CardsPatchAction} from '../../../states/storage/cards/cards-patch.action';
import {CardsPublishAction} from '../../../states/storage/cards/cards-publish.action';
import {CardsState} from '../../../states/storage/cards/cards.state';
import {DragState} from '../../../states/editor/drag/drag.state';
import {Rectangle} from '../../../utils/shapes/rectangle';
import {KeyboardService} from '../../dev-tools/keyboard/keyboard.service';
import {LogService} from '../../dev-tools/log/log.service';
import {DragEventsService} from '../../drag/drag-events/drag-events.service';
import {DragManagerEvent} from '../../drag/drag-manager.event';
import {CardEntity} from '../../networks/entities/card.entity';
import {ItemEntity} from '../../networks/entities/item.entity';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-group-drop-item-target',
    templateUrl: './group-drop-item-target.component.html',
    styleUrls: ['./group-drop-item-target.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[@fadeInOut]': 'true'
    },
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({opacity: 0, height: 0}),
                animate('300ms ease-in-out', style({opacity: 1, height: '*'}))
            ]),
            transition(':leave', [
                style({opacity: 1, height: '*'}),
                animate('300ms ease-in-out', style({opacity: 0, height: 0}))
            ])
        ])
    ]
})
export class GroupDropItemTargetComponent implements OnInit, OnDestroy {
    @Input()
    public dropToFront: boolean = false;

    @Input()
    public groupId: EntityIdType;

    public isHovered$: Observable<boolean>;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _dragEvents: DragEventsService,
                       private _keyboard: KeyboardService,
                       private _el: ElementRef<HTMLElement>,
                       private _zone: NgZone,
                       log: LogService) {
        this._log = log.withPrefix(GroupDropItemTargetComponent.name);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this.isHovered$ = this._dragEvents.onMove().pipe(
            map((event: DragManagerEvent) => {
                    const rect = Rectangle.fromRef(this._el);
                    return rect.inside(event.move);
                }
            )
        );

        this._dragEvents.onDrop().pipe(
            withLatestFrom(this.isHovered$, this._keyboard.ctrl$),
            filter(([event, isHovered]) => isHovered),
            withLatestFrom(this._store.select(DragState.item), ([event, isHovered, ctrl], item) => [ctrl, item]),
            takeUntil(this._destroyed$)
        ).subscribe(([clone, item]: [boolean, ItemEntity]) => {
            const create = new CardsCreateAction(this._zone);
            create.done$.subscribe(newCardId => {
                this._store.selectOnce(CardsState.byId)
                    .pipe(map(selector => selector(item.card_id)))
                    .subscribe((card: CardEntity) => {
                        this._store.dispatch(new AppSequenceAction([
                            new CardsPatchAction(newCardId, {title: card.title, color: card.color}),
                            new CardsPublishAction(this.groupId, newCardId, this.dropToFront ? 'start' : 'end'),
                            new CardsDropItemAction(item.card_id, newCardId, item.id, [], clone)
                        ]));
                    });
            });
            this._store.dispatch(create);
        });
    }
}
