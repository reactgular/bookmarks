import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Select} from '@ngxs/store';
import {Observable} from 'rxjs';
import {DocumentEntity} from '../../../shared/networks/entities/document.entity';
import {ReactiveTool} from '../../../shared/reactive-tools/reactive-tool';
import {SideBarBackground, SideBarComponentStyle} from '../../../shared/side-bars/side-bars.types';
import {AppState} from '../../../states/app/app.state';
import {EditorState} from '../../../states/editor/editor.state';
import {GENERAL_SIDE_TOOLS} from '../general-tools/general-providers';

@Component({
    selector: 'tag-side-bar-main',
    templateUrl: './general-side-bar.component.html',
    styleUrls: ['./general-side-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralSideBarComponent implements SideBarComponentStyle {
    @Select(EditorState.isCreateDisabled)
    public isCreateDisabled$: Observable<boolean>;

    @Select(AppState.title)
    public title$: Observable<string>;

    public constructor(@Inject(GENERAL_SIDE_TOOLS) public tools: ReactiveTool[]) {
    }

    public getBackground(): SideBarBackground {
        return 'dark';
    }
}
