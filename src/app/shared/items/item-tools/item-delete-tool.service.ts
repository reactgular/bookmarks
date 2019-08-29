import {ElementRef, Injectable, ViewContainerRef} from '@angular/core';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {ItemsDeleteAction} from '../../../states/storage/items/items-delete.action';
import {LogService} from '../../dev-tools/log/log.service';
import {ReactiveTool, ReactiveToolDisabled} from '../../reactive-tools/reactive-tool';
import {ItemContext} from './item-context';

@Injectable()
export class ItemDeleteToolService implements ReactiveTool, ReactiveToolDisabled {
    public readonly order: string = 'item:delete';

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _context: ItemContext,
                       log: LogService) {
        this._log = log.withPrefix(ItemDeleteToolService.name);
    }

    public disabled(): Observable<boolean> {
        return this._context.getItem().pipe(map(item => Boolean(item._new)));
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
        this._context.getItemIdOnce().subscribe(itemId => this._store.dispatch(new ItemsDeleteAction(itemId)));
    }
}
