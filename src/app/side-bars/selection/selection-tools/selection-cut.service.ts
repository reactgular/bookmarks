import {Injectable} from '@angular/core';
import {faCut} from '@fortawesome/free-solid-svg-icons';
import {Observable, of} from 'rxjs';
import {HotKeyDescription, HotKeySectionEnum} from '../../../shared/hot-keys/hot-keys.types';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolHotKey} from '../../../shared/reactive-tools/reactive-tool';

@Injectable()
export class SelectionCutService implements ReactiveTool, ReactiveToolHotKey {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0200:0100'
    };

    public readonly hotKey: HotKeyDescription = {
        code: 'CTRL+X',
        message: 'Cuts cards to the clipboard',
        section: HotKeySectionEnum.SELECTION
    };


    public icon(): Observable<any> {
        return of(faCut);
    }

    public title(): Observable<string> {
        return of('Cut');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
    }
}
