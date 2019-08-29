import {ActionDocumentId} from '../actions/action-document-id';

export class EditorGetDocumentAction {
    public static readonly type: string = '[Editor] get document';

    public constructor(public readonly child: ActionDocumentId) {

    }
}
