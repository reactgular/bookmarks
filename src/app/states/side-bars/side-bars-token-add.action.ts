import {InjectionToken, Type} from '@angular/core';

export class SideBarsTokenAddAction {
    public static readonly type: string = '[SideBars] token add';

    public constructor(public readonly token: InjectionToken<Type<any>>) {

    }
}
