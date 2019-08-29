import {Injectable} from '@angular/core';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {Observable, of} from 'rxjs';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolVisible} from '../../../shared/reactive-tools/reactive-tool';

@Injectable()
export class GeneralAppDownloadService implements ReactiveTool, ReactiveToolVisible {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0300:0300'
    };

    public icon(): Observable<any> {
        return of(faDownload);
    }

    public title(): Observable<string> {
        return of('App downloads');
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
