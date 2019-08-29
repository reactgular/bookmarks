import {DocumentEntity} from '../../../shared/networks/entities/document.entity';
import {ActionDocumentId} from '../../actions/action-document-id';

export class DocumentsPatchAction implements ActionDocumentId {
    public static readonly type: string = '[Documents] patch';

    public constructor(public readonly document_id,
                       public readonly document: Partial<DocumentEntity>) {

    }
}
