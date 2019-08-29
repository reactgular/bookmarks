export class AppSequenceAction {
    public static readonly type: string = '[App] sequence';

    public constructor(public readonly actions: any[]) {
    }
}
