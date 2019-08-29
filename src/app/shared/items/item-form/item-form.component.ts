import {ChangeDetectionStrategy, Component, ElementRef, Inject, Input, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {BehaviorSubject, forkJoin, Observable, ReplaySubject, Subject} from 'rxjs';
import {distinctUntilChanged, filter, first, map, switchMap, takeUntil} from 'rxjs/operators';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {EditorGetDocumentAction} from '../../../states/editor/editor-get-document.action';
import {GroupsPublishAction} from '../../../states/storage/groups/groups-publish.action';
import {ItemsCreateAction} from '../../../states/storage/items/items-create.action';
import {ItemsPatchAction} from '../../../states/storage/items/items-patch.action';
import {ItemsState} from '../../../states/storage/items/items.state';
import {delayTime} from '../../../utils/operators/delay-time';
import {MetaService} from '../../api/meta/meta.service';
import {LogService} from '../../dev-tools/log/log.service';
import {TimeoutService} from '../../dev-tools/timeout/timeout.service';
import {EditorModalInterface} from '../../editor/editor-modal-interface';
import {EDITOR_MODAL_TOKEN} from '../../editor/editor-modal-token';
import {ItemEntity} from '../../networks/entities/item.entity';
import {EntityIdType} from '../../networks/networks.types';
import {TagValidators} from '../../validators/validate-url';
import {ItemMetaToolService} from '../item-tools/item-meta-tool.service';
import {MetaToolData} from '../meta-tool-types';

@Component({
    selector: 'tag-item-form',
    templateUrl: './item-form.component.html',
    styleUrls: ['./item-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFormComponent implements OnInit, OnDestroy {
    public controlTitle: FormControl;

    public controlUrl: FormControl;

    public group: FormGroup;

    @ViewChild('inputTitle', {read: ElementRef, static: true})
    public inputTitle: ElementRef<HTMLInputElement>;

    @ViewChild('inputUrl', {read: ElementRef, static: true})
    public inputUrl: ElementRef<HTMLInputElement>;

    public itemMetaTitle$: Observable<string>;

    private readonly _destroyed$: Subject<void> = new Subject<void>();

    private _item$: Observable<ItemEntity>;

    private readonly _itemId$: ReplaySubject<EntityIdType> = new ReplaySubject(1);

    private readonly _log: LogService;

    private readonly _ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public constructor(private _meta: MetaService,
                       private _store: Store,
                       private _timeOut: TimeoutService,
                       private _zone: NgZone,
                       @Inject(EDITOR_MODAL_TOKEN) private _editorModal: EditorModalInterface,
                       public itemMetaTool: ItemMetaToolService,
                       log: LogService) {
        this._log = log.withPrefix(ItemFormComponent.name);
        this.controlTitle = new FormControl('');
        this.controlUrl = new FormControl('', [TagValidators.validateUrl, Validators.required]);
        this.group = new FormGroup({title: this.controlTitle, url: this.controlUrl});
        this.itemMetaTitle$ = itemMetaTool.title();
    }

    @Input()
    public set itemId(itemId: EntityIdType) {
        this._itemId$.next(itemId);
    }

    @Input()
    public set ready(value: boolean) {
        this._ready$.next(value);
    }

    public keyPressTitle(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.updateItemAndValidate().then(success => success && this._editorModal.close());
        }
    }

    public keyPressUrl(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }

        this.updateItemAndValidate().then(success => {
            if (!success) {
                return;
            }

            this._item$.pipe(
                first()
            ).subscribe((item: ItemEntity) => {
                const actions: any[] = [new EditorGetDocumentAction(new GroupsPublishAction())];
                if (item._new) {
                    actions.push(new ItemsCreateAction(this._zone, item.card_id));
                }
                this._store.dispatch(actions).subscribe(() => {
                    if (this.controlTitle.value) {
                        this._editorModal.close();
                    } else {
                        this.itemMetaTool.fetchMeta();
                    }
                });
            });
        });
    }

    public ngOnDestroy(): void {
        this.itemMetaTool.cancel();
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this._ready$.pipe(
            distinctUntilChanged(),
            filter(Boolean),
            takeUntil(this._destroyed$)
        ).subscribe(() => this.setFocus());

        this.itemMetaTool.beforeTrigger().pipe(
            takeUntil(this._destroyed$)
        ).subscribe(() => {
            this._rewriteUrl();
            this.itemMetaTool.setDisabled(this.group.invalid);
            this.itemMetaTool.setUrl(this.controlUrl.value);
        });

        this.itemMetaTool.getData().pipe(
            delayTime(0),
            takeUntil(this._destroyed$)
        ).subscribe((result: MetaToolData) => {
            if (result.success) {
                if (result.title) {
                    this._setTitle(result.title);
                }
                if (result.image) {
                    this._setImage(result.image);
                }
                this.inputTitle.nativeElement.focus();
            } else {
                if (this.controlTitle.value) {
                    this.inputTitle.nativeElement.focus();
                } else {
                    this.inputUrl.nativeElement.focus();
                }
            }
        });

        this.itemMetaTool.disabled().pipe(
            takeUntil(this._destroyed$)
        ).subscribe(disabled => disabled ? this.group.disable() : this.group.enable());

        this._item$ = this._itemId$.pipe(
            switchMap(itemId => this._store.select(ItemsState.byId).pipe(map(selector => selector(itemId))))
        );

        this._item$.pipe(
            first(),
            takeUntil(this._destroyed$)
        ).subscribe(({title, url}) => this.group.setValue({title, url}));
    }

    public setFocus() {
        forkJoin({
            editorItemId: this._store.selectOnce(CardEditorState.itemId),
            itemId: this._itemId$.pipe(first())
        }).pipe(
            filter(({editorItemId, itemId}) => editorItemId === itemId),
            switchMap(() => this._store.selectOnce(CardEditorState.itemFocusTitle)),
            delayTime(0),
            takeUntil(this._destroyed$)
        ).subscribe(focus => focus ? this.inputTitle.nativeElement.focus() : this.inputUrl.nativeElement.focus());
    }

    public updateItemAndValidate(): Promise<boolean> {
        return new Promise(resolver => {
            this._rewriteUrl();
            if (this.group.invalid) {
                resolver(false);
                return;
            }
            this._item$.pipe(first())
                .subscribe(item => {
                    const patch = Object.keys(this.group.value)
                        .filter(key => this.group.value[key] !== item[key])
                        .reduce((current, key) => ({...current, [key]: this.group.value[key]}), {});
                    this._store.dispatch(new ItemsPatchAction(item.id, patch))
                        .subscribe(() => resolver(true));
                });
        });
    }

    private _rewriteUrl() {
        let url = this.controlUrl.value;
        if (url !== null) {
            url = TagValidators.toUrl(url);
            if (url !== this.controlUrl.value) {
                this.controlUrl.setValue(url);
            }
        }
    }

    private _setImage(image: string) {
        this._itemId$.pipe(
            first(),
            switchMap(itemId => this._store.dispatch(new ItemsPatchAction(itemId, {image})))
        ).subscribe();
    }

    private _setTitle(title: string) {
        this.controlTitle.setValue(title);
        this._itemId$.pipe(
            first(),
            switchMap(itemId => this._store.dispatch(new ItemsPatchAction(itemId, {title})))
        ).subscribe();
    }
}
