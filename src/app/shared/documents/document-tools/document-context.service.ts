import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable, ReplaySubject} from 'rxjs';
import {filter, first, map, switchMap} from 'rxjs/operators';
import {DocumentEntity} from '../../networks/entities/document.entity';
import {EntityIdType} from '../../networks/networks.types';
import {DocumentsState} from '../../../states/storage/documents/documents.state';

@Injectable()
export class DocumentContext {
    private _documentId$: ReplaySubject<EntityIdType> = new ReplaySubject(1);

    public constructor(private _store: Store) {
    }

    public getDocument(): Observable<DocumentEntity> {
        return this._documentId$.pipe(
            switchMap(documentId => this._store.select(DocumentsState.byId).pipe(map(selector => selector(documentId)))),
            filter(Boolean)
        );
    }

    public getDocumentId(): Observable<EntityIdType> {
        return this._documentId$.asObservable();
    }

    public getDocumentIdOnce(): Observable<EntityIdType> {
        return this._documentId$.pipe(first());
    }

    public getDocumentOnce(): Observable<DocumentEntity> {
        return this.getDocument().pipe(first());
    }

    public setDocumentId(documentId: EntityIdType) {
        this._documentId$.next(documentId);
    }
}
