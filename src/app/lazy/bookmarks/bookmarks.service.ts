import {Inject, Injectable, OnDestroy} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Store} from '@ngxs/store';
import {Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import {CardsState} from '../../states/storage/cards/cards.state';
import {ItemsState} from '../../states/storage/items/items.state';
import {LogService} from '../../shared/dev-tools/log/log.service';
import {WINDOW} from '../../shared/dev-tools/window-token';
import {CardEntity} from '../../shared/networks/entities/card.entity';
import {ItemEntity} from '../../shared/networks/entities/item.entity';
import {EntityIdType} from '../../shared/networks/networks.types';

@Injectable({providedIn: 'root'})
export class BookmarksService implements OnDestroy {

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _snackBar: MatSnackBar,
                       @Inject(WINDOW) private _wnd: Window,
                       log: LogService) {
        this._log = log.withPrefix(BookmarksService.name);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public open(url: string, newTab: boolean, focus: boolean) {
        const newWnd = this._wnd.open(url, newTab ? '_blank' : '_self');
        if (newWnd && newTab && focus) {
            newWnd.focus();
        }
        if (!newWnd) {
            // @todo What about multiple open failures?
            this._snackBar.open('Browser blocked opening bookmark, please disable pop-up blocker', 'DISMISS');
        }
    }

    public openCard(cardId: EntityIdType) {
        // @todo Open an array of items as promises, but stop on first failure.
        this._store.selectOnce(CardsState.byId).pipe(
            map(selector => selector(cardId)),
            takeUntil(this._destroyed$)
        ).subscribe((card: CardEntity) => card._item_ids.forEach((itemId, indx) => this.openItem(itemId, true, indx === 0)));
    }

    public openItem(itemId: EntityIdType, newTab: boolean, focus: boolean) {
        this._store.selectOnce(ItemsState.byId).pipe(
            map(selector => selector(itemId)),
            filter((item: ItemEntity) => Boolean(item.url)),
            takeUntil(this._destroyed$)
        ).subscribe((item: ItemEntity) => this.open(item.url, newTab, focus));
    }
}
