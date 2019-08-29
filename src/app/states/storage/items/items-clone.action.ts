import {NgZone} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionItemId} from '../../actions/action-item-id';

export class ItemsCloneAction implements ActionItemId {
    public static readonly type: string = '[Items] clone';

    public constructor(private _zone: NgZone,
                       public readonly item_id: EntityIdType) {
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
