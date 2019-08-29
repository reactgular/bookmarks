export class AppNetworkAction {
    public static readonly type: string = '[App] network';

    public constructor(public read: boolean,
                       public write: boolean) {

    }
}
