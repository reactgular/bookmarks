import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {distinctUntilChanged, map, withLatestFrom} from 'rxjs/operators';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {DragState} from '../../../states/editor/drag/drag.state';
import {SelectionsState} from '../../../states/editor/selections/selections.state';
import {AniOpenCloseEnum} from '../../animations/animations.typets';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-card-outline',
    templateUrl: './card-outline.component.html',
    styleUrls: ['./card-outline.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardOutlineComponent implements OnInit {
    public hide$: Observable<boolean>;

    public isHovered$: Observable<boolean>;

    public isSelected$: Observable<boolean>;

    private readonly _cardId$: ReplaySubject<EntityIdType> = new ReplaySubject<EntityIdType>(1);

    public constructor(private _store: Store) {
    }

    @Input()
    public set cardId(cardId: EntityIdType) {
        this._cardId$.next(cardId);
    }

    public ngOnInit(): void {
        const cardEditorOpen$: Observable<boolean> = combineLatest([
            this._store.select(CardEditorState.cardId),
            this._store.select(CardEditorState.editorState),
            this._cardId$
        ]).pipe(
            map(([editorCardId, editorState, cardId]) => editorCardId === cardId ? editorState !== AniOpenCloseEnum.CLOSE : false)
        );

        const cardDragging$: Observable<boolean> = this._store.select(DragState.isDraggingCardById).pipe(
            withLatestFrom(this._cardId$),
            map(([selector, cardId]) => selector(cardId))
        );

        this.hide$ = combineLatest([cardEditorOpen$, cardDragging$]).pipe(
            map(([cardEditorOpen, cardDragging]) => cardEditorOpen || cardDragging),
            distinctUntilChanged()
        );

        this.isSelected$ = this._store.select(SelectionsState.isSelected).pipe(
            withLatestFrom(this._cardId$),
            map(([selector, cardId]) => selector(cardId)),
            distinctUntilChanged()
        );

        this.isHovered$ = this._store.select(DragState.hoverDragId).pipe(
            withLatestFrom(this._cardId$),
            map(([hoverCardId, cardId]) => hoverCardId === cardId),
            distinctUntilChanged()
        );
    }
}
