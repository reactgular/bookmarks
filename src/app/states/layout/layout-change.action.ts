import {LayoutDevice, LayoutOrientation} from '../models/layout-model';

export class LayoutChangeAction {
    public static readonly type: string = '[Layout] change';

    public constructor(public device: LayoutDevice, public orientation: LayoutOrientation) {

    }
}
