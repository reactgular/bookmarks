import {GroupEntity} from '../../../shared/networks/entities/group.entity';
import {EntityIdType} from '../../../shared/networks/networks.types';

export class GroupsPatchAction {
    public static readonly type: string = '[groups] patch';

    public constructor(public readonly group_id: EntityIdType,
                       public readonly group: Partial<GroupEntity>) {

    }
}
