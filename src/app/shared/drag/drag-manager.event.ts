import {Point} from '../../utils/shapes/point';

export interface DragManagerEvent {
    move?: Point;
    offset?: Point;
    size?: Point;
    type: 'start' | 'move' | 'drop' | 'cancel' | 'end';
}
