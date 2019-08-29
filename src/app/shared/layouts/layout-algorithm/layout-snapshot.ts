import {Rectangle} from '../../../utils/shapes/rectangle';
import {EntityIdType} from '../../networks/networks.types';

export interface LayoutSnapshot {
    id: EntityIdType;
    rect: Rectangle;
}
