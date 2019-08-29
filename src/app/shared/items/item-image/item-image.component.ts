import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {distinctUntilChanged, filter, map, switchMap} from 'rxjs/operators';
import {ItemsState} from '../../../states/storage/items/items.state';
import {ItemEntity} from '../../networks/entities/item.entity';
import {EntityIdType} from '../../networks/networks.types';

interface ImageUrl {
    url: string;
    error: boolean;
}

@Component({
    selector: 'tag-item-image',
    templateUrl: './item-image.component.html',
    styleUrls: ['./item-image.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemImageComponent implements OnInit, OnDestroy {
    public url: string;

    public url$: Observable<string>;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _itemId$: ReplaySubject<EntityIdType> = new ReplaySubject(1);

    private readonly _failure$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public constructor(private _store: Store,
                       private _change: ChangeDetectorRef) {
    }

    @Input()
    public set itemId(itemId: EntityIdType) {
        this._itemId$.next(itemId);
        this._failure$.next(false);
    }

    public loadFailure() {
        this._failure$.next(true);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this.url$ = this._itemId$.pipe(
            switchMap(itemId => this._store.select(ItemsState.byId).pipe(map(selector => selector(itemId)))),
            filter(Boolean),
            map(({image}: ItemEntity) => image),
            distinctUntilChanged(),
            switchMap(url => this._failure$.pipe(map(failure => failure ? null : url)))
        );
    }
}
