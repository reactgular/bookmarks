import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {filter, first, takeUntil} from 'rxjs/operators';
import {CardEditorItemIdAction} from '../../../states/editor/card-editor/card-editor-item-id.action';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {CardsPatchAction} from '../../../states/storage/cards/cards-patch.action';
import {LogService} from '../../dev-tools/log/log.service';
import {EditorModalInterface} from '../../editor/editor-modal-interface';
import {EDITOR_MODAL_TOKEN} from '../../editor/editor-modal-token';
import {CardEntity} from '../../networks/entities/card.entity';
import {ReactiveTool} from '../../reactive-tools/reactive-tool';
import {CardContext} from '../card-tools/card-context';
import {CARD_TOOL_PROVIDERS, CARD_TOOL_TOKEN} from '../card-tools/card-tool-providers';

@Component({
    selector: 'tag-card-edit',
    templateUrl: './card-edit.component.html',
    styleUrls: ['./card-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        CardContext,
        ...CARD_TOOL_PROVIDERS
    ]
})
export class CardEditComponent implements AfterViewInit, OnInit, OnDestroy {
    @Select(CardEditorState.card)
    public card$: Observable<CardEntity>;

    @ViewChild('editTitle', {static: false})
    public editTitle: ElementRef<HTMLInputElement>;

    @Select(CardEditorState.isCardEditorFullyOpen)
    public isCardEditorOpen$: Observable<boolean>;

    @Select(CardEditorState.isNewCard)
    public isNewCard$: Observable<boolean>;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _context: CardContext,
                       private _router: Router,
                       @Inject(EDITOR_MODAL_TOKEN) private _editorModal: EditorModalInterface,
                       @Inject(CARD_TOOL_TOKEN) public cardTools: ReactiveTool[],
                       log: LogService) {
        this._log = log.withPrefix(CardEditComponent.name);
    }

    public close() {
        this._log.debug('close');
        this._editorModal.close();
    }

    public closeItem() {
        this.card$
            .pipe(first())
            .subscribe(card => {
                if (card._item_ids.length > 1) {
                    this._store.dispatch(new CardEditorItemIdAction(null));
                }
            });
    }

    public ngAfterViewInit(): void {
        this._store.selectOnce(CardEditorState.cardFocusTitle)
            .pipe(filter(Boolean))
            .subscribe(() => this.editTitle.nativeElement.focus());
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this.card$
            .pipe(filter(Boolean), takeUntil(this._destroyed$))
            .subscribe(card => this._context.setCardId(card.id));

        this._router.events.pipe(
            filter(event => event instanceof NavigationStart),
            takeUntil(this._destroyed$)
        ).subscribe(value => this.close());
    }

    public setCardTitle(title: any) {
        this.card$
            .pipe(first())
            .subscribe((card: CardEntity) => this._store.dispatch(new CardsPatchAction(card.id, {title})));
    }
}
