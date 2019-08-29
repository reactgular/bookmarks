import {EntityIdType} from '../../../shared/networks/networks.types';
import {DragStateEnum, DragType} from '../../models/drag-model';

export class DragStartAction {
    public static readonly type: string = '[Drag] start';

    public constructor(public readonly type: DragType,
                       public readonly state: DragStateEnum,
                       public readonly drag_id: EntityIdType) {
    }
}
