import {animate, state, style, transition, trigger} from '@angular/animations';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Select} from '@ngxs/store';
import {Observable} from 'rxjs';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {EditorState} from '../../../states/editor/editor.state';
import {CardEntity} from '../../networks/entities/card.entity';
import {EntityIdType} from '../../networks/networks.types';
import {editorAnimation} from '../editor-animations';

@Component({
    selector: 'tag-editor-color-bg',
    templateUrl: './editor-color-bg.component.html',
    styleUrls: ['./editor-color-bg.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('editorColorBg', [
            state('open', style({opacity: 0})),
            state('close', style({opacity: 1})),
            transition('void => open', [
                style({opacity: 1}),
                animate(editorAnimation, style({opacity: 0}))
            ]),
            transition('void => close', [
                style({opacity: 0}),
                animate(editorAnimation, style({opacity: 1}))
            ])
        ])
    ]
})
export class EditorColorBgComponent {
    @Select(CardEditorState.card)
    public card$: Observable<CardEntity>;

    @Input()
    public direction: 'open' | 'close';

    @Select(CardEditorState.isNewCard)
    public isNewCard$: Observable<boolean>;
}
