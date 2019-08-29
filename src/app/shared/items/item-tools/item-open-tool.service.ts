import {Injectable} from '@angular/core';
import {faLink} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {BookmarksService} from '../../../lazy/bookmarks/bookmarks.service';
import {LogService} from '../../dev-tools/log/log.service';
import {ReactiveTool} from '../../reactive-tools/reactive-tool';
import {ItemContext} from './item-context';

@Injectable()
export class ItemOpenToolService implements ReactiveTool {
    public readonly order: string = 'item:open';

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _context: ItemContext,
                       private _bookmarks: BookmarksService,
                       log: LogService) {
        this._log = log.withPrefix(ItemOpenToolService.name);
    }

    public icon(): Observable<any> {
        return of(faLink);
    }

    public title(): Observable<string> {
        return of('Open in new tab');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
        this._context.getItemIdOnce().subscribe(itemId => this._bookmarks.openItem(itemId, true, true));
    }
}
