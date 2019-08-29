import {Inject, Injectable} from '@angular/core';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {GroupsDeleteCardAction} from '../../../states/storage/groups/groups-delete-card.action';
import {LogService} from '../../dev-tools/log/log.service';
import {DialogsService} from '../../dialogs/dialogs/dialogs.service';
import {EditorModalInterface} from '../../editor/editor-modal-interface';
import {EDITOR_MODAL_TOKEN} from '../../editor/editor-modal-token';
import {CardEntity} from '../../networks/entities/card.entity';
import {EntityIdType} from '../../networks/networks.types';
import {ReactiveTool, ReactiveToolDisabled} from '../../reactive-tools/reactive-tool';
import {CardContext} from './card-context';

@Injectable()
export class CardDeleteToolService implements ReactiveTool, ReactiveToolDisabled {
    public readonly order: string = 'card:delete';

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _context: CardContext,
                       private _dialogs: DialogsService,
                       @Inject(EDITOR_MODAL_TOKEN) private _editorModal: EditorModalInterface,
                       log: LogService) {
        this._log = log.withPrefix(CardDeleteToolService.name);
    }

    public disabled(): Observable<boolean> {
        return this._context.getCard().pipe(map(card => Boolean(card._new)));
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
        this._context.getCardOnce().subscribe(card => this._confirmDelete(card));
    }

    private _confirmDelete(card: CardEntity) {
        if (card._item_ids.length) {
            this._dialogs.confirm({
                title: 'Delete',
                message: `Permanently delete this card?`,
                icon: faTrash,
                okay: {title: 'Delete', color: 'warn'}
            }).pipe(filter(Boolean))
                .subscribe(() => this._delete(card.id));
        } else {
            this._delete(card.id);
        }
    }

    private _delete(cardId: EntityIdType) {
        this._editorModal.close().subscribe(() => this._store.dispatch(new GroupsDeleteCardAction(cardId)));
    }
}
