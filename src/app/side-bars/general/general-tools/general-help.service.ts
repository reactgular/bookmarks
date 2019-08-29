import {Injectable} from '@angular/core';
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import {Navigate} from '@ngxs/router-plugin';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolStyle} from '../../../shared/reactive-tools/reactive-tool';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {routerUrl} from '../../../utils/operators/router-url';

@Injectable()
export class GeneralHelpService implements ReactiveTool, ReactiveToolStyle {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0300:0100'
    };

    public constructor(private _store: Store,
                       private _router: Router) {
    }

    public icon(): Observable<any> {
        return of(faQuestionCircle);
    }

    public title(): Observable<string> {
        return of('Help');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
        this._store.dispatch(new Navigate(['/']));
    }

    public color(): Observable<'success' | 'warning' | 'danger' | 'info' | void> {
        return undefined;
    }

    public highlight(): Observable<boolean> {
        return routerUrl(this._router).pipe(map(url => (url === '/' || url.startsWith('/guide/')) && url !== '/guide/contact-us'));
    }
}
