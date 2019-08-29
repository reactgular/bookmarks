import {CardEntity, CardResponse} from '../../../shared/networks/entities/card.entity';
import {DocumentEntity, DocumentResponse} from '../../../shared/networks/entities/document.entity';
import {GroupEntity, GroupResponse} from '../../../shared/networks/entities/group.entity';
import {ItemEntity} from '../../../shared/networks/entities/item.entity';

export class DocumentsAddAction {
    public static readonly type: string = '[Documents] add';

    public readonly cards: CardEntity[] = [];

    public readonly document: DocumentEntity;

    public readonly groups: GroupEntity[] = [];

    public readonly items: ItemEntity[] = [];

    public constructor(documentResponse: DocumentResponse) {
        const {groups, ...document} = documentResponse;
        this.document = document;
        this.document._group_ids = [];
        this.groups = groups.map((groupResponse: GroupResponse) => {
            const {cards, ...group} = groupResponse;
            this.document._group_ids.push(group.id);
            group._card_ids = cards.map((cardResponse: CardResponse) => {
                const {items, ...card} = cardResponse;
                card._item_ids = items.map(item => item.id);
                this.cards.push(card);
                this.items.push(...items);
                return card.id;
            });
            return group;
        });
    }
}
