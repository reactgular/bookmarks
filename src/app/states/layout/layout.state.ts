import {Action, Selector, State, StateContext} from '@ngxs/store';
import {LayoutModel} from '../models/layout-model';
import {LayoutChangeAction} from './layout-change.action';

type LayoutContext = StateContext<LayoutModel>;

@State<LayoutModel>({
    name: 'layout',
    defaults: {
        device: 'web',
        orientation: 'landscape'
    }
})
export class LayoutState {
    @Selector()
    public static deviceOrientation(state: LayoutModel) {
        return [state.device, state.orientation];
    }

    @Selector()
    public static isHandset(state: LayoutModel) {
        return state.device === 'handset';
    }

    @Selector()
    public static isTablet(state: LayoutModel) {
        return state.device === 'tablet';
    }

    @Selector()
    public static isWeb(state: LayoutModel) {
        return state.device === 'web';
    }

    @Action(LayoutChangeAction)
    public layoutChange(ctx: LayoutContext, action: LayoutChangeAction) {
        ctx.patchState({
            device: action.device,
            orientation: action.orientation
        });
    }

    // @todo Needs to be repeated with the new side bar (close on nav change)
    // @Action(Navigate)
    // public navigateChange(ctx: LayoutContext) {
    //     const state = ctx.getState();
    //     if (state.device !== 'web' && state.sideBar) {
    //         ctx.patchState({sideBar: false});
    //     }
    // }
}
