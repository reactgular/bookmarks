import {Injectable} from '@angular/core';
import {faClone} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppSequenceAction} from '../../../states/app/app-sequence.action';
import {CardsCloneAction} from '../../../states/storage/cards/cards-clone.action';
import {SelectionsClearAction} from '../../../states/editor/selections/selections-clear.action';
import {LogService} from '../../dev-tools/log/log.service';
import {ReactiveTool, ReactiveToolDisabled} from '../../reactive-tools/reactive-tool';
import {CardContext} from './card-context';

@Injectable()
export class CardCloneToolService implements ReactiveTool, ReactiveToolDisabled {
    public readonly order: string = 'card:0400';

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _context: CardContext,
                       log: LogService) {
        this._log = log.withPrefix(CardCloneToolService.name);
    }

    public disabled(): Observable<boolean> {
        return this._context.getCard().pipe(map(card => Boolean(card._new)));
    }

    public icon(): Observable<any> {
        return of(faClone);
    }

    public title(): Observable<string> {
        return of('Make a copy');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
        this._context.getCardIdOnce().subscribe(cardId => {
            this._store.dispatch(new AppSequenceAction([
                new SelectionsClearAction(),
                // new CardEditorCloseAction(),
                new CardsCloneAction([cardId])
            ]));
        });
    }
}
