import {Injectable, Optional} from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable, ReplaySubject} from 'rxjs';
import {filter, first, map, switchMap} from 'rxjs/operators';
import {ItemsState} from '../../../states/storage/items/items.state';
import {CardContext} from '../../cards/card-tools/card-context';
import {ItemEntity} from '../../networks/entities/item.entity';
import {EntityIdType} from '../../networks/networks.types';

@Injectable()
export class ItemContext {
    private _itemId$: ReplaySubject<EntityIdType> = new ReplaySubject(1);

    public constructor(private _store: Store,
                       @Optional() public readonly card: CardContext) {
    }

    public getItem(): Observable<ItemEntity> {
        return this._itemId$.pipe(
            switchMap(itemId => this._store.select(ItemsState.byId).pipe(map(selector => selector(itemId)))),
            filter(Boolean)
        );
    }

    public getItemId(): Observable<EntityIdType> {
        return this._itemId$.asObservable();
    }

    public getItemIdOnce(): Observable<EntityIdType> {
        return this._itemId$.pipe(first());
    }

    public getItemOnce(): Observable<ItemEntity> {
        return this.getItem().pipe(first());
    }

    public setItemId(itemId: EntityIdType) {
        this._itemId$.next(itemId);
    }
}
