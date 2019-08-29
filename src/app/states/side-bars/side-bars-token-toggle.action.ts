import {InjectionToken, Type} from '@angular/core';

export class SideBarsTokenToggleAction {
    public static readonly type: string = '[SideBars] token toggle';

    public constructor(public readonly token: InjectionToken<Type<any>>) {

    }
}
