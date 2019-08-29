import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChildren
} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {BehaviorSubject, combineLatest, Observable, ReplaySubject, Subject} from 'rxjs';
import {debounceTime, filter, first, map, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {DragState} from '../../../states/editor/drag/drag.state';
import {DragModel, DragStateEnum} from '../../../states/models/drag-model';
import {GroupsPatchAction} from '../../../states/storage/groups/groups-patch.action';
import {GroupsReorderCardsAction} from '../../../states/storage/groups/groups-reorder-cards.action';
import {GroupsState} from '../../../states/storage/groups/groups.state';
import {distinctStringify} from '../../../utils/operators/distinct-stringify';
import {Rectangle} from '../../../utils/shapes/rectangle';
import {KeyboardService} from '../../dev-tools/keyboard/keyboard.service';
import {LogService} from '../../dev-tools/log/log.service';
import {TimeoutService} from '../../dev-tools/timeout/timeout.service';
import {WINDOW} from '../../dev-tools/window-token';
import {DragEventsService} from '../../drag/drag-events/drag-events.service';
import {DragManagerEvent} from '../../drag/drag-manager.event';
import {LayoutSnapshot} from '../../layouts/layout-algorithm/layout-snapshot';
import {LayoutTilesComponent} from '../../layouts/layout-tiles/layout-tiles.component';
import {GroupEntity} from '../../networks/entities/group.entity';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupComponent implements OnDestroy, OnInit, AfterViewInit {
    public cardIds$: Observable<EntityIdType[]>;

    @Select(DragState.isDragToCard)
    public dragToCard$: Observable<boolean>;

    public editTitle: boolean = false;

    public group$: Observable<GroupEntity>;

    @ViewChildren(LayoutTilesComponent)
    public layoutTiles: QueryList<LayoutTilesComponent>;

    private readonly _arrangeLayout$: Subject<void> = new Subject();

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _dragCardIds$: BehaviorSubject<EntityIdType[]> = new BehaviorSubject(null);

    private readonly _groupId: ReplaySubject<EntityIdType> = new ReplaySubject<EntityIdType>(1);

    private readonly _log: LogService;

    private _snapshot: Promise<LayoutSnapshot[]>;

    public constructor(private _store: Store,
                       private _dragEvents: DragEventsService,
                       private _keyboard: KeyboardService,
                       private _el: ElementRef<HTMLElement>,
                       private _timeout: TimeoutService,
                       @Inject(WINDOW) private _wnd: Window,
                       log: LogService) {
        this._log = log.withPrefix(GroupComponent.name);
    }

    @Input()
    public set groupId(groupId: EntityIdType) {
        this._groupId.next(groupId);
    }

    public dragReorder(dragId: EntityIdType, targetId: EntityIdType) {
        this.group$.pipe(
            first(),
            takeUntil(this._destroyed$)
        ).subscribe((group: GroupEntity) => {
            let cardIds = group._card_ids;
            if (dragId !== targetId) {
                const dragIndx = cardIds.indexOf(dragId);
                const targetIndx = cardIds.indexOf(targetId);
                cardIds = cardIds.filter(id => id !== dragId);
                const above = dragIndx > targetIndx;
                cardIds.splice(cardIds.indexOf(targetId) + (above ? 0 : 1), 0, dragId);
            }
            this._log.debug('dragReorder', cardIds);
            this._dragCardIds$.next(cardIds);
        });
    }

    public ngAfterViewInit(): void {
        this.cardIds$.pipe(
            switchMap(() => this._timeout.run()),
            takeUntil(this._destroyed$)
        ).subscribe(() => this._arrangeLayout$.next());
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this.group$ = this._groupId.pipe(
            switchMap(groupId => this._store.select(GroupsState.byId).pipe(map(selector => selector(groupId))))
        );

        this.cardIds$ = combineLatest([
            this.group$.pipe(filter(Boolean)),
            this._dragCardIds$
        ]).pipe(
            map(([group, ids]: [GroupEntity, EntityIdType[]]) => ids === null ? group._card_ids : ids),
            distinctStringify()
        );

        this._arrangeLayout$.pipe(
            debounceTime(250),
            takeUntil(this._destroyed$)
        ).subscribe(() => this.layoutTiles.first.arrangeLayout());

        this._dragStart();
        this._dragMove();
        this._dragDrop();
        this._dragEnd();
    }

    public setTitle(groupId: EntityIdType, title: any) {
        this._store.dispatch(new GroupsPatchAction(groupId, {title}));
    }

    private _dragDrop() {
        this._dragEvents.onDrop().pipe(
            withLatestFrom(this._store.select(DragState)),
            filter(([event, dragState]: [DragManagerEvent, DragModel]) => dragState.state === DragStateEnum.SORT_CARDS),
            takeUntil(this._destroyed$)
        ).subscribe(() => {
            combineLatest([
                this.group$,
                this.cardIds$
            ]).pipe(
                filter(([group, cardIds]: [GroupEntity, EntityIdType[]]) => JSON.stringify(group._card_ids) !== JSON.stringify(cardIds)),
                first()
            ).subscribe(([group, cardIds]: [GroupEntity, EntityIdType[]]) => {
                this._store.dispatch(new GroupsReorderCardsAction(group.id, cardIds));
            });
        });
    }

    private _dragEnd() {
        this._dragEvents.onEnd()
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                this._snapshot = null;
                this._dragCardIds$.next(null);
            });
    }

    private _dragMove() {
        this._dragEvents.onMove().pipe(
            withLatestFrom(this._store.select(DragState)),
            filter(([event, dragState]: [DragManagerEvent, DragModel]) => dragState.state === DragStateEnum.SORT_CARDS),
            takeUntil(this._destroyed$)
        ).subscribe(([event, dragState]: [DragManagerEvent, DragModel]) => {
            const rect = Rectangle.fromRef(this._el);
            this._snapshot.then(snapshots => {
                const hit = snapshots.find(snapshot => snapshot.rect.inside(event.move));
                if (hit) {
                    this._log.debug('HIT', {dragId: dragState.drag_id, hit: hit.id});
                    this.dragReorder(dragState.drag_id, hit.id);
                }
            });
        });
    }

    private _dragStart() {
        this._dragEvents.onStart()
            .pipe(
                withLatestFrom(this._store.select(DragState.state), this.group$),
                filter(([event, state]) => state === DragStateEnum.SORT_CARDS),
                takeUntil(this._destroyed$)
            )
            .subscribe(([event, dragState, group]: [DragManagerEvent, DragStateEnum, GroupEntity]) => {
                this._snapshot = this.layoutTiles.first.arrangeLayout();
                this._dragCardIds$.next(group._card_ids);
            });
    }
}
