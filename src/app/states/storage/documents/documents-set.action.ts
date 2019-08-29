import {DocumentEntity} from '../../../shared/networks/entities/document.entity';

export class DocumentsSetAction {
    public static readonly type: string = '[Documents] set';

    public constructor(public readonly documents: DocumentEntity[]) {

    }
}
