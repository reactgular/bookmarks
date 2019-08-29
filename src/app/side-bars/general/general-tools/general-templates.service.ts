import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {faFileAlt} from '@fortawesome/free-solid-svg-icons';
import {Navigate} from '@ngxs/router-plugin';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {HotKeyDescription, HotKeySectionEnum} from '../../../shared/hot-keys/hot-keys.types';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolStyle} from '../../../shared/reactive-tools/reactive-tool';
import {ReactiveToolContext} from '../../../shared/reactive-tools/reactive-tool-context';
import {routerUrl} from '../../../utils/operators/router-url';

@Injectable()
export class GeneralTemplatesService implements ReactiveTool, ReactiveToolStyle {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0100:0100'
    };

    public readonly hotKey: HotKeyDescription = {
        code: 'CTRL+T',
        message: 'Opens the document templates',
        section: HotKeySectionEnum.GENERAL
    };

    public constructor(private _store: Store,
                       private _router: Router) {
    }

    public color(): Observable<'success' | 'warning' | 'danger' | 'info' | void> {
        return undefined;
    }

    public highlight(): Observable<boolean> {
        return routerUrl(this._router).pipe(map(url => url === '/templates'));
    }

    public icon(): Observable<any> {
        return of(faFileAlt);
    }

    public title(): Observable<string> {
        return of('Create Document');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger(context?: ReactiveToolContext) {
        this._store.dispatch(new Navigate(['/templates']));
    }
}
