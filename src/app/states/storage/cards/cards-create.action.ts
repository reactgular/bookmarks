import {NgZone} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {EntityIdType} from '../../../shared/networks/networks.types';

export class CardsCreateAction {
    public static readonly type: string = '[Cards] create';

    public constructor(private _zone: NgZone) {

    }

    private _done$: Subject<EntityIdType> = new Subject();

    public get done$(): Observable<EntityIdType> {
        return this._done$.asObservable();
    }

    public done(cardId: EntityIdType) {
        this._zone.run(() => {
            this._done$.next(cardId);
            this._done$.complete();
        });
    }
}
