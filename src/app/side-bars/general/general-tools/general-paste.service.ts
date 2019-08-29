import {Injectable} from '@angular/core';
import {faPaste} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {HotKeyDescription, HotKeySectionEnum} from '../../../shared/hot-keys/hot-keys.types';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolDisabled, ReactiveToolHotKey} from '../../../shared/reactive-tools/reactive-tool';
import {ReactiveToolContext} from '../../../shared/reactive-tools/reactive-tool-context';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';

@Injectable()
export class GeneralPasteService implements ReactiveTool, ReactiveToolHotKey, ReactiveToolDisabled {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0100:0100'
    };

    public readonly hotKey: HotKeyDescription = {
        code: 'CTRL+V',
        message: 'Pastes the clipboard contents',
        section: HotKeySectionEnum.GENERAL
    };

    public readonly order: string;

    public constructor(private _store: Store) {

    }

    public disabled(): Observable<boolean> {
        return this._store.select(CardEditorState.isCardEditorOpen);
    }

    public icon(): Observable<any> {
        return of(faPaste);
    }

    public title(): Observable<string> {
        return of('Paste');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger(context?: ReactiveToolContext) {
    }
}
