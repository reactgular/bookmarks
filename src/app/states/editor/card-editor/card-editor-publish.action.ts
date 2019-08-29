import {EntityIdType} from '../../../shared/networks/networks.types';
import {ActionDocumentId} from '../../actions/action-document-id';
import {ActionGroupId} from '../../actions/action-group-id';

export class CardEditorPublishAction implements ActionDocumentId, ActionGroupId {
    public static readonly type: string = '[CardEditor] publish';

    public constructor(public readonly document_id: EntityIdType,
                       public readonly group_id: EntityIdType) {
    }
}
