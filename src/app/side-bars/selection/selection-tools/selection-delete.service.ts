import {Injectable} from '@angular/core';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {filter} from 'rxjs/operators';
import {DialogsService} from '../../../shared/dialogs/dialogs/dialogs.service';
import {HotKeyDescription, HotKeySectionEnum} from '../../../shared/hot-keys/hot-keys.types';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {ReactiveTool, ReactiveToolDisabled, ReactiveToolHotKey} from '../../../shared/reactive-tools/reactive-tool';
import {AppSequenceAction} from '../../../states/app/app-sequence.action';
import {GroupsDeleteCardAction} from '../../../states/storage/groups/groups-delete-card.action';
import {SelectionsClearAction} from '../../../states/editor/selections/selections-clear.action';
import {SelectionsState} from '../../../states/editor/selections/selections.state';

@Injectable()
export class SelectionDeleteService implements ReactiveTool, ReactiveToolHotKey, ReactiveToolDisabled {
    public readonly hotKey: HotKeyDescription = {
        code: 'DEL',
        humanCode: 'Del, Backspace',
        message: 'Deletes selected cards',
        section: HotKeySectionEnum.SELECTION
    };

    public readonly order: string = '0999:0200';

    public constructor(private _store: Store,
                       private _dialogs: DialogsService) {

    }

    public disabled(): Observable<boolean> {
        return this._store.select(SelectionsState.noneSelected);
    }

    public icon(): Observable<any> {
        return of(faTrash);
    }

    public title(): Observable<string> {
        return of('Delete');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
        this._store.selectOnce(SelectionsState.selected).subscribe(cardIds => this._confirmDelete(cardIds));
    }

    private _confirmDelete(cardIds: EntityIdType[]) {
        this._dialogs.confirm({
            title: 'Delete',
            message: `Permanently delete the ${cardIds.length} selected cards?`,
            icon: faTrash,
            okay: {title: 'Delete', color: 'warn'}
        }).pipe(filter(Boolean))
            .subscribe(() => this._delete(cardIds));
    }

    private _delete(cardIds: EntityIdType[]) {
        const actions = cardIds.map(cardId => new GroupsDeleteCardAction(cardId));
        this._store.dispatch(new AppSequenceAction([
            new SelectionsClearAction(),
            ...actions
        ]));
    }
}
