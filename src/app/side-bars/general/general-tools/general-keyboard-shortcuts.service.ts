import {Injectable} from '@angular/core';
import {faKeyboard} from '@fortawesome/free-solid-svg-icons';
import {Observable, of} from 'rxjs';
import {DialogsService} from '../../../shared/dialogs/dialogs/dialogs.service';
import {HotKeysDialogComponent} from '../../../shared/hot-keys/hot-keys-dialog/hot-keys-dialog.component';
import {HotKeyDescription} from '../../../shared/hot-keys/hot-keys.types';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolHotKey} from '../../../shared/reactive-tools/reactive-tool';

@Injectable()
export class GeneralKeyboardShortcutsService implements ReactiveTool, ReactiveToolHotKey {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0300:0200'
    };

    public readonly hotKey: HotKeyDescription = {code: 'SHIFT+?', humanCode: '?', message: 'Displays the keyboard shortcuts'};

    public constructor(private _dialogs: DialogsService) {

    }

    public icon(): Observable<any> {
        return of(faKeyboard);
    }

    public title(): Observable<string> {
        return of('Keyboard shortcuts');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
        this._dialogs.open(HotKeysDialogComponent);
    }
}
