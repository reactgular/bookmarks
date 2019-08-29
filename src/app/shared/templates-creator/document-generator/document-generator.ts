import {CardResponse} from '../../networks/entities/card.entity';
import {DocumentResponse} from '../../networks/entities/document.entity';
import {GroupResponse} from '../../networks/entities/group.entity';
import {ItemResponse} from '../../networks/entities/item.entity';
import {TemplateEntry} from '../../networks/entities/template.entity';
import {EntityId, EntityIdType, EntityTimestamp} from '../../networks/networks.types';
import {EditorNextIds} from '../../../states/editor/editor-next-ids';

export class DocumentGenerator {

    private readonly _entries: TemplateEntry[][];

    private readonly _nextIds: EditorNextIds;

    public constructor(nextIds: EditorNextIds,
                       entries: TemplateEntry[],
                       private readonly _title: string) {
        this._nextIds = {...nextIds};
        this._entries = DocumentGenerator.chunk(entries);
    }

    private static chunk<TType>(arr: TType[]): TType[][] {
        const chunk = 10;
        const result = [];
        for (let i = 0; i < arr.length; i += chunk) {
            result.push(arr.slice(i, i + chunk));
        }
        return result;
    }

    private static createId(id: EntityIdType): EntityId {
        return {id};
    }

    private static createTimestamp(): EntityTimestamp {
        return {
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
        };
    }

    public createDocument(): DocumentResponse {
        const document_id = this._nextIds.document_id++;
        const doc: DocumentResponse = {
            ...DocumentGenerator.createId(document_id),
            ...DocumentGenerator.createTimestamp(),
            archived: false,
            label_ids: [],
            order: document_id,
            title: this._title,
            groups: []
        };
        if (this._entries.length) {
            doc.groups.push(this.createGroup(document_id));
        }
        return doc;
    }

    private createCard(group_id: EntityIdType, entries: TemplateEntry[], title?: string): CardResponse {
        const card_id = this._nextIds.card_id++;
        return {
            ...DocumentGenerator.createId(card_id),
            ...DocumentGenerator.createTimestamp(),
            color: 0,
            group_id,
            label_ids: [],
            order: card_id,
            title,
            items: this.createItems(card_id, entries)
        };
    }

    private createCards(group_id: EntityIdType): CardResponse[] {
        return this._entries.map(entries => {
            return this.createCard(group_id, entries);
        });
    }

    private createGroup(document_id: EntityIdType, title?: string): GroupResponse {
        const group_id = this._nextIds.group_id++;
        return {
            ...DocumentGenerator.createId(group_id),
            ...DocumentGenerator.createTimestamp(),
            document_id,
            order: group_id,
            title,
            cards: this.createCards(group_id)
        };
    }

    private createItem(card_id: EntityIdType, {image, title, url}: TemplateEntry): ItemResponse {
        const item_id = this._nextIds.item_id++;
        return {
            ...DocumentGenerator.createId(item_id),
            ...DocumentGenerator.createTimestamp(),
            card_id,
            order: item_id,
            image,
            title,
            url
        };
    }

    private createItems(card_id: EntityIdType, entries: TemplateEntry[]): ItemResponse[] {
        return entries.map(entry => this.createItem(card_id, entry));
    }
}
