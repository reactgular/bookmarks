import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CardEntity} from '../../../shared/networks/entities/card.entity';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {ReactiveTool} from '../../../shared/reactive-tools/reactive-tool';
import {CardsPatchAction} from '../../../states/storage/cards/cards-patch.action';
import {SelectionsState} from '../../../states/editor/selections/selections.state';
import {SELECTION_TOOLS} from '../selection-tools/selection-providers';
import {SelectionSelectAllService} from '../selection-tools/selection-select-all.service';

@Component({
    selector: 'tag-selection-side-bar',
    templateUrl: './selection-side-bar.component.html',
    styleUrls: ['./selection-side-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionSideBarComponent implements OnInit {
    public colors$: Observable<number[]>;

    @Select(SelectionsState.count)
    public count$: Observable<number>;

    public constructor(private _store: Store,
                       public selectAll: SelectionSelectAllService,
                       @Inject(SELECTION_TOOLS) public tools: ReactiveTool[]) {
    }

    public ngOnInit(): void {
        this.colors$ = this._store.select(SelectionsState.cards).pipe(
            map((cards: CardEntity[]) => cards.map(card => card.color))
        );
    }

    public setColor(color: number) {
        this._store.selectOnce(SelectionsState.selected)
            .subscribe((cardIds: EntityIdType[]) => {
                this._store.dispatch(cardIds.map(cardId => new CardsPatchAction(cardId, {color})));
            });
    }
}
