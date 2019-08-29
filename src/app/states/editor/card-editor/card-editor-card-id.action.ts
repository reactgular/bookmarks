import {EntityIdType} from '../../../shared/networks/networks.types';

export class CardEditorCardIdAction {
    public static readonly type: string = '[CardEditor] card ID';

    public constructor(public readonly card_id: EntityIdType) {

    }
}
