import {EntityIdType} from '../../../shared/networks/networks.types';
import {DragHoverType} from '../../models/drag-model';

export class DragHoverAction {
    public static readonly type: string = '[Drag] hover';

    public constructor(public readonly type: DragHoverType,
                       public readonly drag_id: EntityIdType) {
    }
}
