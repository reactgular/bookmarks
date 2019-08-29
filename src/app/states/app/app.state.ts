import {RouterNavigation} from '@ngxs/router-plugin';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Observable, Subscriber} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AppModel} from '../models/app-model';
import {AppMetaAction} from './app-meta.action';
import {AppNetworkAction} from './app-network.action';
import {AppSearchAction} from './app-search.action';
import {AppSequenceAction} from './app-sequence.action';

type AppContext = StateContext<AppModel>;

@State<AppModel>({
    name: 'app',
    defaults: {
        meta: null,
        networkRead: false,
        networkWrite: false,
        search: false
    }
})
export class AppState {
    @Selector()
    public static meta(state: AppModel) {
        return state.meta;
    }

    @Selector()
    public static network(state: AppModel) {
        return state.networkRead || state.networkWrite;
    }

    @Selector()
    public static networkRead(state: AppModel) {
        return state.networkRead;
    }

    @Selector()
    public static networkWrite(state: AppModel) {
        return state.networkWrite;
    }

    @Selector()
    public static search(state: AppModel) {
        return state.search;
    }

    @Selector()
    public static title(state: AppModel) {
        return state.meta.title || environment.brand;
    }

    @Action(AppNetworkAction)
    public AppNetworkAction({patchState}: AppContext, action: AppNetworkAction) {
        patchState({networkRead: action.read, networkWrite: action.write});
    }

    @Action(AppMetaAction)
    public appMetaAction({patchState}: AppContext, {meta}: AppMetaAction) {
        patchState({meta});
    }

    @Action(AppSearchAction)
    public appSearchAction({patchState}: AppContext, {search}: AppSearchAction) {
        patchState({search});
    }

    @Action(AppSequenceAction)
    public appSequenceAction(ctx: AppContext, {actions}: AppSequenceAction) {
        return new Observable<void>(subscriber => this.dispatchSequence(subscriber, ctx, actions));
    }

    @Action(RouterNavigation)
    public routerNavigation({patchState}: AppContext) {
        patchState({meta: null});
    }

    private dispatchSequence(subscriber: Subscriber<void>, ctx: AppContext, actions: any[]) {
        if (actions.length) {
            const action = actions.shift();
            ctx.dispatch(action).subscribe(() => this.dispatchSequence(subscriber, ctx, actions));
        } else {
            subscriber.next();
            subscriber.complete();
        }
    }
}
