import {AniOpenCloseEnum} from '../../shared/animations/animations.typets';

export class SideBarsStateAction {
    public static readonly type: string = '[SideBars] state';

    public constructor(public readonly state: AniOpenCloseEnum) {

    }
}
