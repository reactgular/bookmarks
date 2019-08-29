import {AniOpenCloseEnum} from '../../../shared/animations/animations.typets';

export class CardEditorStateAction {
    public static readonly type: string = '[CardEditor] state';

    public constructor(public readonly editorState: AniOpenCloseEnum) {

    }
}
