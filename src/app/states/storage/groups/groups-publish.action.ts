import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionDocumentId} from '../../actions/action-document-id';

export class GroupsPublishAction implements ActionDocumentId {
    public static readonly type: string = '[Groups] publish';

    public document_id: EntityIdType;
}
