import {Injectable} from '@angular/core';
import {faCopy} from '@fortawesome/free-solid-svg-icons';
import {Observable, of} from 'rxjs';
import {HotKeyDescription, HotKeySectionEnum} from '../../../shared/hot-keys/hot-keys.types';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolHotKey} from '../../../shared/reactive-tools/reactive-tool';

@Injectable()
export class SelectionCopyService implements ReactiveTool, ReactiveToolHotKey {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0200:0200'
    };

    public readonly hotKey: HotKeyDescription = {
        code: 'CTRL+C',
        message: 'Copies cards to the clipboard',
        section: HotKeySectionEnum.SELECTION
    };

    public icon(): Observable<any> {
        return of(faCopy);
    }

    public title(): Observable<string> {
        return of('Copy');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
    }
}
