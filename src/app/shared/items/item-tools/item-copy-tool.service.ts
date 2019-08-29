import {ElementRef, Injectable, ViewContainerRef} from '@angular/core';
import {faCopy} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {ClipboardService} from '../../dev-tools/clipboard/clipboard.service';
import {LogService} from '../../dev-tools/log/log.service';
import {ReactiveTool, ReactiveToolDisabled} from '../../reactive-tools/reactive-tool';
import {ItemContext} from './item-context';

@Injectable()
export class ItemCopyToolService implements ReactiveTool, ReactiveToolDisabled {
    public readonly order: string = 'clipboard:copy';

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _context: ItemContext,
                       private _clipboard: ClipboardService,
                       log: LogService) {
        this._log = log.withPrefix(ItemCopyToolService.name);
    }

    public disabled(): Observable<boolean> {
        return this._context.getItem().pipe(map(item => Boolean(item._new) || !item.url));
    }

    public icon(): Observable<any> {
        return of(faCopy);
    }

    public title(): Observable<string> {
        return of('Copy');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
        this._context.getItemOnce().subscribe(item => this._clipboard.copy(item.url));
    }
}
