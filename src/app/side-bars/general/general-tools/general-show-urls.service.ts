import {Injectable} from '@angular/core';
import {faCheck, faLink} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {KeyboardService} from '../../../shared/dev-tools/keyboard/keyboard.service';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {HotKeyDescription, HotKeySectionEnum} from '../../../shared/hot-keys/hot-keys.types';
import {
    ReactiveTool,
    ReactiveToolConfig,
    ReactiveToolDisabled,
    ReactiveToolHotKey,
    ReactiveToolVisible
} from '../../../shared/reactive-tools/reactive-tool';
import {ReactiveToolContext} from '../../../shared/reactive-tools/reactive-tool-context';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {EditorShowUrlsAction} from '../../../states/editor/editor-show-urls.action';
import {EditorState} from '../../../states/editor/editor.state';

@Injectable()
export class GeneralShowUrlsService implements ReactiveTool, ReactiveToolVisible, ReactiveToolHotKey, ReactiveToolDisabled {
    public readonly config: Partial<ReactiveToolConfig> = {
        down: true,
        up: true,
        order: '0999:0100'
    };

    public readonly hotKey: HotKeyDescription = {
        code: 'SHIFT',
        message: 'Show URLs for bookmarks',
        section: HotKeySectionEnum.GENERAL
    };

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _keyboard: KeyboardService,
                       log: LogService) {
        this._log = log.withPrefix(GeneralShowUrlsService.name);
    }

    public disabled(): Observable<boolean> {
        return this._store.select(CardEditorState.isCardEditorFullyOpen);
    }

    public icon(): Observable<any> {
        return this._store.select(EditorState.showUrls).pipe(map(value => value ? faCheck : faLink));
    }

    public title(): Observable<string> {
        return of('Show URLs');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger(context?: ReactiveToolContext) {
        if (context && context.when === 'down') {
            this._store.dispatch(new EditorShowUrlsAction(true));
        } else if (context && context.when === 'up') {
            this._store.dispatch(new EditorShowUrlsAction(false));
        }
    }

    public visible(): Observable<boolean> {
        return of(false);
    }
}
