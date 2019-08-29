import {AniOpenCloseEnum} from '../../shared/animations/animations.typets';
import {EntityIdType} from '../../shared/networks/networks.types';

export interface CardEditorModel {
    cardFocusTitle: boolean;
    card_id: EntityIdType | null;
    editorState: AniOpenCloseEnum;
    itemFocusTitle: boolean;
    item_id: EntityIdType | null;
}
