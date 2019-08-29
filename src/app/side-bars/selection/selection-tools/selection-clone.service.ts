import {Injectable} from '@angular/core';
import {faClone} from '@fortawesome/free-solid-svg-icons';
import {Observable, of} from 'rxjs';
import {HotKeyDescription, HotKeySectionEnum} from '../../../shared/hot-keys/hot-keys.types';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolHotKey} from '../../../shared/reactive-tools/reactive-tool';

@Injectable()
export class SelectionCloneService implements ReactiveTool, ReactiveToolHotKey {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0200:0300'
    };

    public readonly hotKey: HotKeyDescription = {
        code: 'CTRL+ALT+C',
        message: 'Duplicates all selected cards',
        section: HotKeySectionEnum.SELECTION
    };

    public icon(): Observable<any> {
        return of(faClone);
    }

    public title(): Observable<string> {
        return of('Make a copy');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
    }
}
