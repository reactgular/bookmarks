import {OnDestroy} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Action, Actions, Selector, State, StateContext, Store} from '@ngxs/store';
import {of, Subject} from 'rxjs';
import {filter, first, switchMap, takeUntil} from 'rxjs/operators';
import {AniOpenCloseEnum} from '../../shared/animations/animations.typets';
import {DocumentEntity} from '../../shared/networks/entities/document.entity';
import {EntityMap} from '../../shared/networks/entities/entity-map';
import {AppSequenceAction} from '../app/app-sequence.action';
import {CardEditorModel} from '../models/card-editor-model';
import {EditorModel} from '../models/editor-model';
import {CardsUnpublishAction} from '../storage/cards/cards-unpublish.action';
import {DocumentsState} from '../storage/documents/documents.state';
import {GroupsUnpublishAction} from '../storage/groups/groups-unpublish.action';
import {ItemsUnpublishAction} from '../storage/items/items-unpublish.action';
import {CardEditorState} from './card-editor/card-editor.state';
import {DragState} from './drag/drag.state';
import {EditorCardIdAction} from './editor-card-id.action';
import {EditorClearAction} from './editor-clear.action';
import {EditorGetDocumentAction} from './editor-get-document.action';
import {EditorSetDocumentAction} from './editor-set-document.action';
import {EditorShowUrlsAction} from './editor-show-urls.action';
import {EditorUnpublishAction} from './editor-unpublish.action';
import {SelectionsState} from './selections/selections.state';

type EditorContext = StateContext<EditorModel>;

@State<EditorModel>({
    name: 'editor',
    defaults: {
        card_id: null,
        document_id: null,
        show_urls: false
    },
    children: [
        CardEditorState,
        DragState,
        SelectionsState
    ]
})
export class EditorState implements OnDestroy {
    private readonly _destroyed$: Subject<void> = new Subject();

    public constructor(actions: Actions,
                       {events}: Router,
                       store: Store) {
        events.pipe(
            // wait for a route change
            filter(event => event instanceof NavigationStart),
            switchMap(() => {
                // get the current card in the editor
                return store.select(CardEditorState.cardId).pipe(
                    first(),
                    switchMap(cardId => {
                        // wait for the editor to close if there is a card
                        return cardId === null
                            ? of(true)
                            : store.select(EditorState.canChangeRoute);
                    })
                );
            }),
            // switchMap(() => store.select(EditorState.canChangeRoute)),
            filter(Boolean),
            takeUntil(this._destroyed$)
        ).subscribe(() => store.dispatch(new EditorClearAction()));
    }

    @Selector([CardEditorState])
    public static canChangeRoute({card_id}: EditorModel, {editorState}: CardEditorModel) {
        return card_id === null && editorState === AniOpenCloseEnum.CLOSE;
    }

    @Selector()
    public static cardId({card_id}: EditorModel) {
        return card_id;
    }

    @Selector([DocumentsState])
    public static document({document_id}: EditorModel, documents: EntityMap<DocumentEntity>) {
        return document_id !== null ? documents[document_id] : undefined;
    }

    @Selector()
    public static documentId({document_id}: EditorModel) {
        return document_id;
    }

    @Selector([DocumentsState])
    public static isCreateDisabled({document_id}: EditorModel, documents: EntityMap<DocumentEntity>) {
        return !(document_id && documents[document_id]);
    }

    @Selector()
    public static showUrls({show_urls}: EditorModel) {
        return show_urls;
    }

    @Action(EditorCardIdAction)
    public EditorCardIdAction({patchState}: EditorContext, {card_id}: EditorCardIdAction) {
        patchState({card_id});
    }

    @Action(EditorUnpublishAction)
    public EditorUnpublishAction({dispatch}: EditorContext) {
        return dispatch(new AppSequenceAction([
            new ItemsUnpublishAction(),
            new CardsUnpublishAction(),
            new GroupsUnpublishAction(),
        ]));
    }

    @Action(EditorClearAction)
    public editorClearAction({patchState}: EditorContext) {
        patchState({card_id: null, document_id: null});
    }

    @Action(EditorSetDocumentAction)
    public editorDocumentAction({patchState}: EditorContext, {document_id}: EditorSetDocumentAction) {
        patchState({document_id});
    }

    @Action(EditorGetDocumentAction)
    public editorPublishAction(ctx: EditorContext, {child}: EditorGetDocumentAction) {
        child.document_id = ctx.getState().document_id;
        return ctx.dispatch(child);
    }

    @Action(EditorShowUrlsAction)
    public editorShowUrlsAction({patchState}: EditorContext, {show_urls}: EditorShowUrlsAction) {
        patchState({show_urls});
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
