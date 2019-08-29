import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {combineLatest, Observable, Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {AniOpenCloseEnum} from '../../animations/animations.typets';
import {LogService} from '../../dev-tools/log/log.service';
import {EditorModalInterface} from '../../editor/editor-modal-interface';
import {EDITOR_MODAL_TOKEN} from '../../editor/editor-modal-token';

@Component({
    selector: 'tag-card-create-button',
    templateUrl: './card-create-button.component.html',
    styleUrls: ['./card-create-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardCreateButtonComponent implements OnInit, OnDestroy {
    public actionHide$: Observable<boolean>;

    @ViewChild('button', {read: ElementRef, static: true})
    public button: ElementRef<HTMLButtonElement>;

    @Input()
    public disabled: boolean = false;

    @Select(CardEditorState.isNewCard)
    public isNewEmpty$: Observable<boolean>;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       @Inject(EDITOR_MODAL_TOKEN) private _editorModal: EditorModalInterface,
                       private _change: ChangeDetectorRef,
                       log: LogService) {
        this._log = log.withPrefix(CardCreateButtonComponent.name);
    }

    public create() {
        this._editorModal.create();
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        combineLatest([
            this._editorModal.query(),
            this.isNewEmpty$
        ]).pipe(
            filter(values => values[1]),
            takeUntil(this._destroyed$)
        ).subscribe(values => values[0].done(this.button.nativeElement.getBoundingClientRect()));

        this.actionHide$ = combineLatest([
            this._store.select(CardEditorState.editorState),
            this.isNewEmpty$
        ]).pipe(
            map(([state, isNewCard]) => state !== AniOpenCloseEnum.CLOSE && isNewCard)
        );
    }
}
