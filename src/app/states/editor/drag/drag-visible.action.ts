import {EntityIdType} from '../../../shared/networks/networks.types';
import {DragType} from '../../models/drag-model';

export class DragVisibleAction {
    public static readonly type: string = '[Drag] visible';

    public constructor(public readonly type: DragType,
                       public readonly drag_id: EntityIdType,
                       public readonly visible: boolean) {
    }
}
