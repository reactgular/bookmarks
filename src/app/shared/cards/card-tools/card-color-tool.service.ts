import {Injectable} from '@angular/core';
import {faPalette} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {CardsPatchAction} from '../../../states/storage/cards/cards-patch.action';
import {EditorCardIdAction} from '../../../states/editor/editor-card-id.action';
import {LogService} from '../../dev-tools/log/log.service';
import {ReactiveTool, ReactiveToolStyle} from '../../reactive-tools/reactive-tool';
import {ReactiveToolMouse} from '../../reactive-tools/reactive-tool-context';
import {CardColorModalService} from '../card-color-modal/card-color-modal.service';
import {CardContext} from './card-context';

@Injectable()
export class CardColorToolService implements ReactiveTool, ReactiveToolStyle {
    public readonly order: string = 'card:0200';

    private _highlight$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _context: CardContext,
                       private _cardColor: CardColorModalService,
                       log: LogService) {
        this._log = log.withPrefix(CardColorToolService.name);
    }

    public color(): Observable<'success' | 'warning' | 'danger' | 'info' | void | void> {
        return of();
    }

    public highlight(): Observable<boolean> {
        return this._highlight$;
    }

    public icon(): Observable<any> {
        return of(faPalette);
    }

    public title(): Observable<string> {
        return of('Color');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger(context: ReactiveToolMouse) {
        this._highlight$.next(true);
        this._context.getCardOnce()
            .subscribe(card => {
                this._store.dispatch(new EditorCardIdAction(card.id));
                this._cardColor.open(card.color, context.el, context.view, 'below')
                    .pipe(finalize(() => {
                        this._highlight$.next(false);
                        this._store.dispatch(new EditorCardIdAction(null));
                    }))
                    .subscribe(color => this._store.dispatch(new CardsPatchAction(card.id, {color})));
            });
    }
}
