import {Injectable} from '@angular/core';
import {faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {Observable, of} from 'rxjs';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolStyle} from '../../../shared/reactive-tools/reactive-tool';
import {Store} from '@ngxs/store';
import {Navigate} from '@ngxs/router-plugin';
import {Router} from '@angular/router';
import {routerUrl} from '../../../utils/operators/router-url';
import {map} from 'rxjs/operators';

@Injectable()
export class GeneralSendFeedbackService implements ReactiveTool, ReactiveToolStyle {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0300:0300'
    };

    public constructor(private _store: Store,
                       private _router: Router) {

    }

    public icon(): Observable<any> {
        return of(faEnvelope);
    }

    public title(): Observable<string> {
        return of('Send feedback');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
        this._store.dispatch(new Navigate(['/guide/contact-us']));
    }

    public color(): Observable<'success' | 'warning' | 'danger' | 'info' | void> {
        return of(undefined);
    }

    public highlight(): Observable<boolean> {
        return routerUrl(this._router).pipe(map(url => url === '/guide/contact-us'));
    }
}
