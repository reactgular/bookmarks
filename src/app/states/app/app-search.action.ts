export class AppSearchAction {
    public static readonly type: string = '[App] search';

    public constructor(public readonly search: boolean) {

    }
}
