import {ElementRef, Injectable, ViewContainerRef} from '@angular/core';
import {faCut} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {LogService} from '../../dev-tools/log/log.service';
import {ReactiveTool, ReactiveToolDisabled} from '../../reactive-tools/reactive-tool';
import {CardContext} from './card-context';

@Injectable()
export class CardCutToolService implements ReactiveTool, ReactiveToolDisabled {
    public readonly order: string = 'clipboard:cut';

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _context: CardContext,
                       log: LogService) {
        this._log = log.withPrefix(CardCutToolService.name);
    }

    public disabled(): Observable<boolean> {
        return this._context.getCard().pipe(map(card => Boolean(card._new)));
    }

    public icon(): Observable<any> {
        return of(faCut);
    }

    public title(): Observable<string> {
        return of('Cut');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
    }
}
