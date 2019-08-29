import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {first, map, switchMap} from 'rxjs/operators';
import {CardEditorItemIdAction} from '../../../states/editor/card-editor/card-editor-item-id.action';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {ItemsState} from '../../../states/storage/items/items.state';
import {KeyboardService} from '../../dev-tools/keyboard/keyboard.service';
import {LogService} from '../../dev-tools/log/log.service';
import {CardEntity} from '../../networks/entities/card.entity';
import {ItemEntity} from '../../networks/entities/item.entity';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-item-edit-trigger',
    templateUrl: './item-edit-trigger.component.html',
    styleUrls: ['./item-edit-trigger.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(click)': 'click($event)' as string
    }
})
export class ItemEditTriggerComponent implements OnInit {

    public item$: Observable<ItemEntity>;

    public showLongUrl$: Observable<boolean>;

    public itemId$: ReplaySubject<EntityIdType> = new ReplaySubject(1);

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _keyboard: KeyboardService,
                       log: LogService) {
        this._log = log.withPrefix(ItemEditTriggerComponent.name);
    }

    @Input()
    public set itemId(itemId: EntityIdType) {
        this.itemId$.next(itemId);
    }

    public click(event: MouseEvent, focusTitle: boolean = true) {
        event.stopPropagation();
        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }
        event.preventDefault();

        const isItemOpen$: Observable<boolean> = this._store.select(CardEditorState.itemId).pipe(
            switchMap(editItemId => this.itemId$.pipe(map(itemId => itemId === editItemId)))
        );

        const isItemNew$ = this.item$.pipe(map(item => item._new));

        const canOpenEditor$ = combineLatest([
            this._store.select(CardEditorState.card),
            isItemOpen$,
        ]).pipe(
            map(([card, isItemOpen]: [CardEntity, boolean]) => card._item_ids.length !== 1 || !isItemOpen)
        );

        combineLatest([
            canOpenEditor$,
            isItemNew$,
            this.itemId$
        ]).pipe(
            first()
        ).subscribe(([canOpen, isNew, itemId]: [boolean, boolean, EntityIdType]) => {
            if (canOpen) {
                this._store.dispatch(new CardEditorItemIdAction(itemId, !isNew && focusTitle));
            }
        });
    }

    public ngOnInit(): void {
        this.item$ = this.itemId$.pipe(
            switchMap(itemId => this._store.select(ItemsState.byId).pipe(map(selector => selector(itemId))))
        );
        this.showLongUrl$ = combineLatest([
            this._keyboard.shift$,
            this._store.select(CardEditorState.isItemEditorOpen)
        ]).pipe(
            map(([shift, open]) => shift && !open)
        );

    }
}
