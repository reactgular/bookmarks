import {Inject, Injectable} from '@angular/core';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {combineLatest, Observable, of} from 'rxjs';
import {first, map} from 'rxjs/operators';
import {CardEditorItemIdAction} from '../../../states/editor/card-editor/card-editor-item-id.action';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {AniOpenCloseEnum} from '../../animations/animations.typets';
import {LogService} from '../../dev-tools/log/log.service';
import {EditorModalInterface} from '../../editor/editor-modal-interface';
import {EDITOR_MODAL_TOKEN} from '../../editor/editor-modal-token';
import {CardEntity} from '../../networks/entities/card.entity';
import {ReactiveTool, ReactiveToolDisabled} from '../../reactive-tools/reactive-tool';
import {CardContext} from './card-context';

@Injectable()
export class CardAppendToolService implements ReactiveTool, ReactiveToolDisabled {
    public readonly order: string = 'card:0100';

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _context: CardContext,
                       @Inject(EDITOR_MODAL_TOKEN) private _editorModal: EditorModalInterface,
                       log: LogService) {
        this._log = log.withPrefix(CardAppendToolService.name);
    }

    public disabled(): Observable<boolean> {
        return this._context.getCard().pipe(map(card => Boolean(card._new)));
    }

    public icon(): Observable<any> {
        return of(faPlus);
    }

    public title(): Observable<string> {
        return of('Add bookmark');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
        combineLatest([
            this._store.select(CardEditorState.editorState),
            this._context.getCard()
        ]).pipe(
            first()
        ).subscribe(([state, card]: [AniOpenCloseEnum, CardEntity]) => {
            if (state === AniOpenCloseEnum.OPEN) {
                this._store.dispatch(new CardEditorItemIdAction(card._item_ids[card._item_ids.length - 1]));
            } else {
                this._editorModal.edit(card.id, false).then(() => {
                    this._context.getCardOnce().subscribe(c => {
                        this._store.dispatch(new CardEditorItemIdAction(c._item_ids[c._item_ids.length - 1]));
                    });
                });
            }
        });
    }
}
