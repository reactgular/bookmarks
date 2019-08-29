import {ElementRef, Injectable, NgZone, ViewContainerRef} from '@angular/core';
import {faObjectGroup} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {combineLatest, forkJoin, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {CardEntity} from '../../../shared/networks/entities/card.entity';
import {GroupEntity} from '../../../shared/networks/entities/group.entity';
import {ReactiveTool, ReactiveToolDisabled} from '../../../shared/reactive-tools/reactive-tool';
import {AppSequenceAction} from '../../../states/app/app-sequence.action';
import {CardsPatchAction} from '../../../states/storage/cards/cards-patch.action';
import {EditorGetDocumentAction} from '../../../states/editor/editor-get-document.action';
import {GroupsAddCardAction} from '../../../states/storage/groups/groups-add-card.action';
import {GroupsCreateAction} from '../../../states/storage/groups/groups-create.action';
import {GroupsDeleteEmptyAction} from '../../../states/storage/groups/groups-delete-empty.action';
import {GroupsPatchAction} from '../../../states/storage/groups/groups-patch.action';
import {GroupsRemoveCardAction} from '../../../states/storage/groups/groups-remove-card.action';
import {SelectionsClearAction} from '../../../states/editor/selections/selections-clear.action';
import {SelectionsState} from '../../../states/editor/selections/selections.state';

@Injectable()
export class SelectionGroupService implements ReactiveTool, ReactiveToolDisabled {
    public readonly order: string = '0200:0400';

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _zone: NgZone,
                       log: LogService) {
        this._log = log.withPrefix(SelectionGroupService.name);
    }

    public disabled(): Observable<boolean> {
        const minCount$ = this._store.select(SelectionsState.count).pipe(map(count => count < 2));

        const sameGroup$ =
            combineLatest([
                this._store.select(SelectionsState.cards),
                this._store.select(SelectionsState.groups)
            ]).pipe(
                map(([cards, groups]: [CardEntity[], GroupEntity[]]) => {
                    return groups.length === 1
                        ? groups[0]._card_ids.length === cards.length
                        : false;
                })
            );

        return combineLatest([minCount$, sameGroup$]).pipe(map(values => values.some(Boolean)));
    }

    public icon(): Observable<any> {
        return of(faObjectGroup);
    }

    public title(): Observable<string> {
        return of('Group together');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
        forkJoin([
            this._store.selectOnce(SelectionsState.cards),
            this._store.selectOnce(SelectionsState.groups)
        ]).subscribe(([cards, groups]: [CardEntity[], GroupEntity[]]) => {
            const firstGroup = groups.filter(group => Boolean(group.title)).shift();
            const action = new GroupsCreateAction(this._zone);
            action.done$.subscribe(groupId => {
                const actions = [];
                if (firstGroup) {
                    actions.push(new GroupsPatchAction(groupId, {title: firstGroup.title}));
                }
                cards.forEach((card: CardEntity) => {
                    actions.push(new GroupsRemoveCardAction(card.group_id, card.id));
                    actions.push(new GroupsAddCardAction(groupId, card.id, 'end'));
                    actions.push(new CardsPatchAction(card.id, {group_id: groupId}));
                });
                this._store.dispatch(actions).subscribe(() => {
                    this._store.dispatch(new GroupsDeleteEmptyAction());
                });
            });

            this._store.dispatch(new AppSequenceAction([
                new SelectionsClearAction(),
                new EditorGetDocumentAction(action)
            ]));
        });
    }
}
