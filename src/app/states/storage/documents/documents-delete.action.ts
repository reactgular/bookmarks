import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionDocumentId} from '../../actions/action-document-id';

export class DocumentsDeleteAction implements ActionDocumentId {
    public static readonly type: string = '[Documents] delete';

    public constructor(public readonly document_id: EntityIdType,
                       public readonly persist: boolean = true) {

    }
}
