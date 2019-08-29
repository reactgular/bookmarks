import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {Observable, ReplaySubject} from 'rxjs';
import {first, map, withLatestFrom} from 'rxjs/operators';
import {SelectionsToggleAction} from '../../../states/editor/selections/selections-toggle.action';
import {SelectionsState} from '../../../states/editor/selections/selections.state';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-card-select',
    templateUrl: './card-select.component.html',
    styleUrls: ['./card-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(click)': '$event.stopPropagation()' as string
    }
})
export class CardSelectComponent implements OnInit {
    public checkIcon = faCheck;

    public isSelected$: Observable<boolean>;

    @Input()
    public show: boolean;

    public someSelected$: Observable<boolean>;

    private readonly _cardId$: ReplaySubject<EntityIdType> = new ReplaySubject<EntityIdType>(1);

    public constructor(private _store: Store) {
        this.someSelected$ = this._store.select(SelectionsState.someSelected);
    }

    @Input()
    public set cardId(cardId: EntityIdType) {
        this._cardId$.next(cardId);
    }

    public click() {
        this._cardId$
            .pipe(first())
            .subscribe(cardId => this._store.dispatch(new SelectionsToggleAction(cardId)));
    }

    public ngOnInit(): void {
        this.isSelected$ = this._store.select(SelectionsState.isSelected).pipe(
            withLatestFrom(this._cardId$),
            map(([selector, cardId]) => selector(cardId))
        );
    }
}
