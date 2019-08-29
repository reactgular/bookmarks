import {ElementRef, Injectable, ViewContainerRef} from '@angular/core';
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {combineLatest, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {CardEditorItemIdAction} from '../../../states/editor/card-editor/card-editor-item-id.action';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {CardEntity} from '../../networks/entities/card.entity';
import {ReactiveTool, ReactiveToolDisabled, ReactiveToolVisible} from '../../reactive-tools/reactive-tool';
import {ItemContext} from './item-context';

@Injectable()
export class ItemCloseToolService implements ReactiveTool, ReactiveToolDisabled, ReactiveToolVisible {
    public readonly order: string = 'item:close';

    public constructor(private _store: Store,
                       private _context: ItemContext) {

    }

    public disabled(): Observable<boolean> {
        return this._context.card
            ? this._context.card.getCard().pipe(map((card: CardEntity) => card._item_ids.length === 1))
            : of(false);
    }

    public icon(): Observable<any> {
        return of(faTimesCircle);
    }

    public title(): Observable<string> {
        return of('Close');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
        this._store.dispatch(new CardEditorItemIdAction(null));
    }

    public visible(): Observable<boolean> {
        return combineLatest([
            this._store.select(CardEditorState.itemId),
            this._context.getItemId()
        ]).pipe(map(([a, b]) => a === b));
    }
}
