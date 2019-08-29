import {InjectionToken, Type} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {AniOpenCloseEnum} from '../../shared/animations/animations.typets';
import {LayoutChangeAction} from '../layout/layout-change.action';
import {LayoutState} from '../layout/layout.state';
import {LayoutModel} from '../models/layout-model';
import {SideBarsModel} from '../models/side-bars-model';
import {SideBarsHeaderCloseAction} from './side-bars-header-close.action';
import {SideBarsPanelOverlayAction} from './side-bars-panel-overlay.action';
import {SideBarsStateAction} from './side-bars-state.action';
import {SideBarsToggleAction} from './side-bars-toggle.action';
import {SideBarsTokenAddAction} from './side-bars-token-add.action';
import {SideBarsTokenRemoveAction} from './side-bars-token-remove.action';
import {SideBarsTokenToggleAction} from './side-bars-token-toggle.action';

type SideBarsContext = StateContext<SideBarsModel>;

@State<SideBarsModel>({
    name: 'sideBars',
    defaults: {
        panelOverlay: false,
        state: AniOpenCloseEnum.OPEN,
        tokens: []
    }
})
export class SideBarsState {
    @Selector()
    public static hasToken(state: SideBarsModel) {
        return (token: InjectionToken<Type<any>>) => state.tokens.includes(token);
    }

    @Selector()
    public static isAnimating(state: SideBarsModel) {
        return state.state === AniOpenCloseEnum.OPENING || state.state === AniOpenCloseEnum.CLOSING;
    }

    @Selector()
    public static isFirstToken(state: SideBarsModel) {
        return (token: InjectionToken<Type<any>>) => Boolean(state.tokens.length) && state.tokens[0] === token;
    }

    @Selector()
    public static isOpen(state: SideBarsModel) {
        return state.state === AniOpenCloseEnum.OPEN;
    }

    @Selector()
    public static layoutChanged(state: SideBarsModel) {
        return state.state === AniOpenCloseEnum.OPEN || state.state === AniOpenCloseEnum.CLOSE;
    }

    @Selector()
    public static panelOverlay(state: SideBarsModel) {
        return state.panelOverlay;
    }

    @Selector([LayoutState])
    public static showOverlay(state: SideBarsModel, layout: LayoutModel) {
        return layout.device !== 'web' && state.state !== AniOpenCloseEnum.CLOSE;
    }

    @Selector()
    public static state(state: SideBarsModel) {
        return state.state;
    }

    @Selector()
    public static tokens(state: SideBarsModel) {
        return state.tokens;
    }

    @Action(LayoutChangeAction)
    public layoutChangeAction(ctx: SideBarsContext, action: LayoutChangeAction) {
        const state = ctx.getState().state;
        if ((action.device === 'web' && state === AniOpenCloseEnum.CLOSE)
            || (action.device !== 'web' && state === AniOpenCloseEnum.OPEN)) {
            return ctx.dispatch(new SideBarsToggleAction());
        }
    }

    @Action(SideBarsHeaderCloseAction)
    public sideBarsHeaderCloseAction(ctx: SideBarsContext) {
        const tokens = ctx.getState().tokens;
        return ctx.dispatch(new SideBarsTokenRemoveAction(tokens[0]));
    }

    @Action(SideBarsPanelOverlayAction)
    public sideBarsPanelOverlayAction(ctx: SideBarsContext, {panelOverlay}: SideBarsPanelOverlayAction) {
        ctx.patchState({panelOverlay});
    }

    @Action(SideBarsStateAction)
    public sideBarsStateAction(ctx: SideBarsContext, {state}: SideBarsStateAction) {
        ctx.patchState({state});
    }

    @Action(SideBarsToggleAction)
    public sideBarsToggleAction(ctx: SideBarsContext) {
        const s = ctx.getState().state;
        if (s === AniOpenCloseEnum.OPEN) {
            ctx.patchState({state: AniOpenCloseEnum.CLOSING});
        } else if (s === AniOpenCloseEnum.CLOSE) {
            ctx.patchState({state: AniOpenCloseEnum.OPENING});
        } else {
            throw new Error('Can not toggle state while animating');
        }
    }

    @Action(SideBarsTokenAddAction)
    public sideBarsTokenAddAction(ctx: SideBarsContext, {token}: SideBarsTokenAddAction) {
        const tokens = ctx.getState().tokens;
        ctx.patchState({tokens: Array.from(new Set([token, ...tokens]))});
    }

    @Action(SideBarsTokenRemoveAction)
    public sideBarsTokenRemoveAction(ctx: SideBarsContext, {token}: SideBarsTokenRemoveAction) {
        const tokens = ctx.getState().tokens;
        ctx.patchState({tokens: tokens.filter(t => t !== token)});
    }

    @Action(SideBarsTokenToggleAction)
    public sideBarsTokenToggleAction(ctx: SideBarsContext, {token}: SideBarsTokenAddAction) {
        let tokens = ctx.getState().tokens;
        if (tokens.includes(token)) {
            tokens = tokens.filter(t => t !== token);
        } else {
            tokens = [token, ...tokens];
        }
        ctx.patchState({tokens});
    }
}
