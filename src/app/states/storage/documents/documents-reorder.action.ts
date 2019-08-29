export class DocumentsReorderAction {
    public static readonly type: string = '[Documents] reorder';

    public constructor(public readonly persist?: boolean) {

    }
}
