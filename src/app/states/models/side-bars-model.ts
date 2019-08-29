import {InjectionToken, Type} from '@angular/core';
import {AniOpenCloseEnum} from '../../shared/animations/animations.typets';

export class SideBarsModel {
    panelOverlay: boolean;

    state: AniOpenCloseEnum;

    tokens: InjectionToken<Type<any>>[];
}
