import {NgZone} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {EntityIdType} from '../../../shared/networks/networks.types';

export class ItemsCreateAction {
    public static readonly type: string = '[Items] create';

    public constructor(private _zone: NgZone,
                       public readonly card_id: EntityIdType) {
    }

    private _done$: Subject<EntityIdType> = new Subject();

    public get done$(): Observable<EntityIdType> {
        return this._done$.asObservable();
    }

    public done(itemId: EntityIdType) {
        this._zone.run(() => {
            this._done$.next(itemId);
            this._done$.complete();
        });
    }
}
