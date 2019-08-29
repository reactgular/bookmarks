import {InjectionToken, Type} from '@angular/core';

export class SideBarsTokenRemoveAction {
    public static readonly type: string = '[SideBars] token remove';

    public constructor(public readonly token: InjectionToken<Type<any>>) {

    }
}
