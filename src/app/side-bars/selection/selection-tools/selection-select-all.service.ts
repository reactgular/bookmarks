import {Injectable, OnDestroy} from '@angular/core';
import {faCheckDouble} from '@fortawesome/free-solid-svg-icons';
import {Actions, ofActionDispatched, Store} from '@ngxs/store';
import {combineLatest, Observable, of, Subject} from 'rxjs';
import {filter, map, takeUntil, withLatestFrom} from 'rxjs/operators';
import {HotKeyDescription, HotKeySectionEnum} from '../../../shared/hot-keys/hot-keys.types';
import {ReactiveTool, ReactiveToolDisabled, ReactiveToolHotKey} from '../../../shared/reactive-tools/reactive-tool';
import {CardEditorStateAction} from '../../../states/editor/card-editor/card-editor-state.action';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {EditorGetDocumentAction} from '../../../states/editor/editor-get-document.action';
import {EditorState} from '../../../states/editor/editor.state';
import {SelectionsAllAction} from '../../../states/editor/selections/selections-all.action';
import {SelectionsClearAction} from '../../../states/editor/selections/selections-clear.action';
import {SelectionsState} from '../../../states/editor/selections/selections.state';

@Injectable()
export class SelectionSelectAllService implements OnDestroy, ReactiveTool, ReactiveToolHotKey, ReactiveToolDisabled {
    public readonly hotKey: HotKeyDescription = {code: 'CTRL+A', message: 'Selects all cards', section: HotKeySectionEnum.SELECTION};

    public readonly order: string = 'main:select';

    private readonly _destroyed$: Subject<void> = new Subject();

    public constructor(private _store: Store,
                       actions$: Actions) {
        // The observable state for the disabled() does not change immediately after a card is clicked. There is enough
        // time for a user to press CTRL+A to select all cards just before the card editor starts to animate opening.
        // This is because there are many steps that need to take place to open the editor.
        actions$.pipe(
            ofActionDispatched(CardEditorStateAction),
            withLatestFrom(this._store.select(SelectionsState.count), (a, b) => b),
            filter(Boolean),
            takeUntil(this._destroyed$)
        ).subscribe(() => this._store.dispatch(new SelectionsClearAction()));
    }

    public disabled(): Observable<boolean> {
        return combineLatest([
            this._store.select(CardEditorState.isCardEditorOpen),
            this._store.select(EditorState.documentId)
        ]).pipe(
            map(([isCardEditorOpen, documentId]) => isCardEditorOpen || !documentId)
        );
    }

    public icon(): Observable<any> {
        return of(faCheckDouble);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public title(): Observable<string> {
        return of('Select all');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
        this._store.dispatch(new EditorGetDocumentAction(new SelectionsAllAction()));
    }
}
