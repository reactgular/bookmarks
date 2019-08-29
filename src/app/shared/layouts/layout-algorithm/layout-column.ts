import {Point} from '../../../utils/shapes/point';
import {Rectangle} from '../../../utils/shapes/rectangle';
import {LayoutPosition} from './layout-position';
import {LayoutSnapshot} from './layout-snapshot';

export class LayoutColumn {
    public constructor(public readonly left: number,
                       public readonly width: number,
                       private readonly _offset: Point,
                       private readonly _gutter: number) {
    }

    private _height: number = 0;

    public get height(): number {
        return this._height;
    }

    public move(position: LayoutPosition): LayoutSnapshot {
        position.move(this.left, this._height, this.width);
        const snapshot = this._snapshot(position);
        this._height += position.getHeight() + this._gutter;
        return snapshot;
    }

    private _snapshot(position: LayoutPosition): LayoutSnapshot {
        return {
            id: position.getId(),
            rect: new Rectangle(this.left, this._height, this.width, position.getHeight()).move(this._offset)
        };
    }
}

