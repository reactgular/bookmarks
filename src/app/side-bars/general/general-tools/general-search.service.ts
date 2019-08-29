import {Injectable} from '@angular/core';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolVisible} from '../../../shared/reactive-tools/reactive-tool';
import {ReactiveToolContext} from '../../../shared/reactive-tools/reactive-tool-context';
import {AppSearchAction} from '../../../states/app/app-search.action';

@Injectable()
export class GeneralSearchService implements ReactiveTool, ReactiveToolVisible {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0100:0100'
    };

    public constructor(private _store: Store) {

    }

    public icon(): Observable<any> {
        return of(faSearch);
    }

    public title(): Observable<string> {
        return of('Search');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger(context?: ReactiveToolContext) {
        this._store.dispatch(new AppSearchAction(true));
    }

    public visible(): Observable<boolean> {
        return of(false);
        // return this._store.select(AppState.search).pipe(map(value => !value));
    }
}
