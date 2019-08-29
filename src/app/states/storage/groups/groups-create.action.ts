import {NgZone} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionDocumentId} from '../../actions/action-document-id';

export class GroupsCreateAction implements ActionDocumentId {
    public static readonly type: string = '[Groups] create';

    public document_id: EntityIdType;

    public constructor(private _zone: NgZone) {

    }

    private _done$: Subject<EntityIdType> = new Subject();

    public get done$(): Observable<EntityIdType> {
        return this._done$.asObservable();
    }

    public done(groupId: EntityIdType) {
        this._zone.run(() => {
            this._done$.next(groupId);
            this._done$.complete();
        });
    }
}
