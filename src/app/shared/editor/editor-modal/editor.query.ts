import {EntityIdType} from '../../networks/networks.types';

export interface EditorQuery {
    cardId: EntityIdType;
    done: (rect: ClientRect | DOMRect) => void;
}
