import {ActionDocumentId} from '../../actions/action-document-id';
import {EntityIdType} from '../../../shared/networks/networks.types';

export class SelectionsAllAction implements ActionDocumentId {
    public static readonly type: string = '[Selections] all';

    public document_id: EntityIdType;
}
