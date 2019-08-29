import {ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {combineLatest, Observable, ReplaySubject, Subject} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {EditorState} from '../../../states/editor/editor.state';
import {ItemsState} from '../../../states/storage/items/items.state';
import {KeyboardService} from '../../dev-tools/keyboard/keyboard.service';
import {LogService} from '../../dev-tools/log/log.service';
import {ItemEntity} from '../../networks/entities/item.entity';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-item-view',
    templateUrl: './item-view.component.html',
    styleUrls: ['./item-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemViewComponent implements OnInit, OnDestroy {

    public item$: Observable<ItemEntity>;

    public showUrl$: Observable<boolean>;

    private readonly _destroyed: Subject<void> = new Subject();

    private readonly _log: LogService;

    private readonly _itemId$: ReplaySubject<EntityIdType> = new ReplaySubject(1);

    public constructor(private _store: Store,
                       private _keyboard: KeyboardService,
                       private _el: ElementRef<HTMLElement>,
                       log: LogService) {
        this._log = log.withPrefix(ItemViewComponent.name);
    }

    @Input()
    public set itemId(value: EntityIdType) {
        this._itemId$.next(value);
    }

    public hasChildElement(parent: Element, child: Element): boolean {
        if (child === this._el.nativeElement) {
            return true;
        } else if (parent === child) {
            return false;
        }
        return child.parentElement
            ? this.hasChildElement(parent, child.parentElement)
            : false;
    }

    public ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }

    public ngOnInit(): void {
        this.item$ = this._itemId$.pipe(
            switchMap(itemId => this._store.select(ItemsState.byId).pipe(map(selector => selector(itemId))))
        );

        this.showUrl$ = combineLatest([
            this._store.select(EditorState.showUrls),
            this.item$.pipe(map(item => item && !item.title))
        ]).pipe(
            map(([showUrls, emptyTitle]) => showUrls || emptyTitle)
        );
    }
}
