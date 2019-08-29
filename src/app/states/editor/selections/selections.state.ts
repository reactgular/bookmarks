import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {CardEntity} from '../../../shared/networks/entities/card.entity';
import {EntityMap} from '../../../shared/networks/entities/entity-map';
import {GroupEntity} from '../../../shared/networks/entities/group.entity';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {SelectionsModel} from '../../models/selections-model';
import {CardsState} from '../../storage/cards/cards.state';
import {GroupsState} from '../../storage/groups/groups.state';
import {SelectionsAllAction} from './selections-all.action';
import {SelectionsClearAction} from './selections-clear.action';
import {SelectionsToggleAction} from './selections-toggle.action';
import {NavigationStart, Router} from '@angular/router';
import {OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {filter, switchMap, takeUntil} from 'rxjs/operators';

type SelectionsContext = StateContext<SelectionsModel>;

@State<SelectionsModel>({
    name: 'selections',
    defaults: {
        cards: []
    }
})
export class SelectionsState implements OnDestroy {

    private readonly _log: LogService;

    private readonly _destroyed$: Subject<void> = new Subject();

    public constructor(private _store: Store,
                       router: Router,
                       log: LogService) {
        this._log = log.withPrefix(SelectionsState.name);

        router.events.pipe(
            filter(event => event instanceof NavigationStart),
            switchMap(() => _store.selectOnce(SelectionsState.someSelected)),
            filter(Boolean),
            takeUntil(this._destroyed$)
        ).subscribe(() => _store.dispatch(new SelectionsClearAction()));
    }

    @Selector([CardsState])
    public static cards(state: SelectionsModel, cards: EntityMap<CardEntity>) {
        return state.cards.map(cardId => cards[cardId]);
    }

    @Selector()
    public static count(state: SelectionsModel) {
        return state.cards.length;
    }

    @Selector([CardsState, GroupsState])
    public static groups(state: SelectionsModel, cards: EntityMap<CardEntity>, groups: EntityMap<GroupEntity>) {
        const group_ids = Array.from(new Set(state.cards.map((cardId: number) => cards[cardId].group_id)));
        return group_ids.map(groupId => groups[groupId]);
    }

    @Selector()
    public static isSelected(state: SelectionsModel) {
        return (cardId: EntityIdType) => state.cards.some(id => id === cardId);
    }

    @Selector()
    public static noneSelected(state: SelectionsModel) {
        return state.cards.length === 0;
    }

    @Selector()
    public static selected(state: SelectionsModel) {
        return state.cards;
    }

    @Selector()
    public static someSelected(state: SelectionsModel) {
        return Boolean(state.cards.length);
    }

    @Action(SelectionsAllAction)
    public selectionsAllAction(ctx: SelectionsContext, action: SelectionsAllAction) {
        const cardsState: EntityMap<CardEntity> = this._store.selectSnapshot(CardsState);
        const groupsState: EntityMap<GroupEntity> = this._store.selectSnapshot(GroupsState);
        const getDocumentId = (group_id: number) => groupsState[group_id] && groupsState[group_id].document_id;
        const cards = Object
            .values(cardsState)
            .map((card: CardEntity) => ({card_id: card.id, document_id: getDocumentId(<number>card.group_id)}))
            .filter(({document_id}) => document_id === action.document_id)
            .map(({card_id}) => card_id);
        ctx.patchState({cards});
    }

    @Action(SelectionsClearAction)
    public selectionsClearAction(ctx: SelectionsContext) {
        ctx.patchState({cards: []});
    }

    @Action(SelectionsToggleAction)
    public selectionsToggleAction(ctx: SelectionsContext, action: SelectionsToggleAction) {
        let cards = [...ctx.getState().cards];
        if (cards.some(id => id === action.card_id)) {
            cards = cards.filter(id => id !== action.card_id);
        } else {
            cards.push(action.card_id);
        }
        ctx.patchState({cards});
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
