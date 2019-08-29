export class EditorShowUrlsAction {
    public static readonly type: string = '[Editor] show URLs';

    public constructor(public readonly show_urls: boolean) {

    }
}
