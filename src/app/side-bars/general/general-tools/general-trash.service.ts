import {Injectable} from '@angular/core';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {Observable, of} from 'rxjs';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolVisible} from '../../../shared/reactive-tools/reactive-tool';

@Injectable()
export class GeneralTrashService implements ReactiveTool, ReactiveToolVisible {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0100:0200'
    };

    public icon(): Observable<any> {
        return of(faTrash);
    }

    public title(): Observable<string> {
        return of('Trash');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
    }

    public visible(): Observable<boolean> {
        return of(false);
    }
}
