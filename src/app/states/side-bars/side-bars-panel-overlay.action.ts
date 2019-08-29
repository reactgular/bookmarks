export class SideBarsPanelOverlayAction {
    public static readonly type: string = '[SideBars] panel overlay';

    public constructor(public readonly panelOverlay: boolean) {

    }
}
