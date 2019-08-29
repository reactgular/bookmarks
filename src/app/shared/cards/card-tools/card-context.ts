import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable, ReplaySubject} from 'rxjs';
import {filter, first, map, switchMap} from 'rxjs/operators';
import {CardsState} from '../../../states/storage/cards/cards.state';
import {CardEntity} from '../../networks/entities/card.entity';
import {EntityIdType} from '../../networks/networks.types';

@Injectable()
export class CardContext {
    private _cardId$: ReplaySubject<EntityIdType> = new ReplaySubject(1);

    public constructor(private _store: Store) {
    }

    public getCard(): Observable<CardEntity> {
        return this._cardId$.pipe(
            switchMap(cardId => this._store.select(CardsState.byId).pipe(map(selector => selector(cardId)))),
            filter(Boolean)
        );
    }

    public getCardId(): Observable<EntityIdType> {
        return this._cardId$.asObservable();
    }

    public getCardIdOnce(): Observable<EntityIdType> {
        return this._cardId$.pipe(first());
    }

    public getCardOnce(): Observable<CardEntity> {
        return this.getCard().pipe(first());
    }

    public setCardId(cardId: EntityIdType) {
        this._cardId$.next(cardId);
    }
}
