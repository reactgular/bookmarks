import {EntityIdType} from '../../../shared/networks/networks.types';

export class DocumentsSortAction {
    public static readonly type: string = '[Documents] sort';

    public constructor(public readonly document_ids?: EntityIdType[],
                       public readonly archive_ids?: EntityIdType[],
                       public readonly persist?: boolean) {

    }
}
