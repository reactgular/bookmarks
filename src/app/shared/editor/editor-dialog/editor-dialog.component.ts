import {AfterContentInit, ChangeDetectionStrategy, Component, Inject, OnDestroy, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {CardEditorStateAction} from '../../../states/editor/card-editor/card-editor-state.action';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {EditorUnpublishAction} from '../../../states/editor/editor-unpublish.action';
import {AniOpenCloseEnum} from '../../animations/animations.typets';
import {LogService} from '../../dev-tools/log/log.service';
import {TimeoutService} from '../../dev-tools/timeout/timeout.service';
import {EntityIdType} from '../../networks/networks.types';
import {EditorDialogClosable} from '../editor-dialog-closable';
import {EditorDialogTransition} from '../editor-dialog-transition';
import {EditorScaleComponent} from '../editor-scale/editor-scale.component';
import {EDITOR_DATA, EditorData} from '../editor-types';
import {EditorDialogStateEnum} from './editor-dialog-state.enum';

@Component({
    selector: 'tag-editor-dialog',
    templateUrl: './editor-dialog.component.html',
    styleUrls: ['./editor-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorDialogComponent implements OnDestroy, AfterContentInit, EditorDialogClosable {

    @Select(CardEditorState.cardId)
    public cardId$: Observable<EntityIdType>;

    public closed: Subject<void> = new Subject();

    public closing: Subject<void> = new Subject();

    public state$: BehaviorSubject<EditorDialogStateEnum> = new BehaviorSubject(EditorDialogStateEnum.HIDDEN_LAYOUT);

    public transition: EditorDialogTransition = null;

    private readonly _destroyed: Subject<void> = new Subject();

    @ViewChild(EditorScaleComponent, { static: true })
    private _editorScale: EditorScaleComponent;

    private _isClosing: boolean = false;

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       @Inject(EDITOR_DATA) public data: EditorData,
                       private _timeOut: TimeoutService,
                       log: LogService) {
        this._log = log.withPrefix(EditorDialogComponent.name);
    }

    public close(): Observable<void> {
        if (!this._isClosing) {
            this._isClosing = true;
            this.closing.next();
            combineLatest([this._store.select(CardEditorState.isNewCard), this.cardId$]).pipe(first())
                .subscribe(([isNewCard, cardId]) => {
                    this._editorScale.getClientRect()
                        .pipe(takeUntil(this._destroyed))
                        .subscribe(from => {
                            this.data.to(cardId).then(to => {
                                this._log.debug('closing', from);
                                this._store.dispatch(new CardEditorStateAction(AniOpenCloseEnum.CLOSING));
                                this.transition = {dir: 'close', from, to};
                                this.state$.next(EditorDialogStateEnum.ANIMATING);
                            });
                        });
                });
        }
        return this.closed.asObservable();
    }

    public ngAfterContentInit(): void {
        this._editorScale.getClientRect()
            .pipe(takeUntil(this._destroyed))
            .subscribe(to => {
                this._log.debug('opening', to);
                this._store.dispatch(new CardEditorStateAction(AniOpenCloseEnum.OPENING));
                this.transition = {dir: 'open', from: this.data.from, to};
                this.state$.next(EditorDialogStateEnum.ANIMATING);
            });
    }

    public ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
        this.closed.complete();
        this.closing.complete();
    }

    public transitionDone() {
        this._store.selectOnce(CardEditorState.editorState)
            .subscribe(state => {
                this.state$.next(EditorDialogStateEnum.VISIBLE_LAYOUT);
                this.transition = null;
                if (state === AniOpenCloseEnum.OPENING) {
                    this._store.dispatch(new CardEditorStateAction(AniOpenCloseEnum.OPEN));
                } else if (state === AniOpenCloseEnum.CLOSING) {
                    this._store.dispatch([
                        new EditorUnpublishAction(),
                        new CardEditorStateAction(AniOpenCloseEnum.CLOSE)
                    ]);
                    this.closed.next();
                } else {
                    throw new Error(`unexpected state: ${state}`);
                }
            });
    }
}
