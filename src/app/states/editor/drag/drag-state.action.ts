import {DragStateEnum} from '../../models/drag-model';

export class DragStateAction {
    public static readonly type: string = '[Drag] state';

    public constructor(public state: DragStateEnum) {

    }
}
