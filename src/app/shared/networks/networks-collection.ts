import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {distinct, map, take} from 'rxjs/operators';
import {Immutable} from '../../utils/immutable';
import {LogService} from '../dev-tools/log/log.service';
import {EntityId} from './networks.types';

interface NetworksStorageMap<TType extends EntityId> {
    [id: number]: TType;
}

/**
 * @todo I'm not sure this is related to the networks module. Maybe move it somewhere else.
 */
@Injectable()
export class NetworksCollection<TType extends EntityId> {
    private _items: ReplaySubject<NetworksStorageMap<TType>> = new ReplaySubject<NetworksStorageMap<TType>>(1);

    private readonly _log: LogService;

    public constructor(log: LogService) {
        this._log = log.withPrefix(NetworksCollection.name);
        this.fromArray([]);
    }

    private static toStorage<TType extends EntityId>(items: TType[]): NetworksStorageMap<TType> {
        const storage: NetworksStorageMap<TType> = {};
        items.forEach((card) => storage[card.id] = card);
        return storage;
    }

    public fromArray(items: TType[]) {
        this._items.next(Immutable.freeze(NetworksCollection.toStorage(items)));
    }

    public get(id: number): Observable<TType> {
        this._log.debug('get', id);
        return this._items.pipe(map((items) => items[id]), distinct());
    }

    public has(id: number): Observable<boolean> {
        this._log.debug('has', id);
        return this._items.pipe(map((items) => Boolean(items[id])), distinct());
    }

    public set(item: TType) {
        this._log.debug('set', item);
        this._items
            .pipe(take(1))
            .subscribe((items: NetworksStorageMap<TType>) => {
                items = Object.assign({}, items);
                items[item.id] = item;
                this._items.next(Immutable.freeze(items));
            });
    }

    public toArray(): Observable<TType[]> {
        return this._items.pipe(map((items) => Immutable.freeze(Object.keys(items).map((id) => items[id]))));
    }
}
