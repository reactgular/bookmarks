import {LayoutColumn} from './layout-column';
import {LayoutPosition} from './layout-position';
import {LayoutSnapshot} from './layout-snapshot';

function ShortestColumn(columns: LayoutColumn[]): LayoutColumn {
    return Array.from(columns).reduce((current, next) => next.height < current.height ? next : current);
}

export class LayoutConstraint {
    public readonly snapshots: LayoutSnapshot[] = [];

    public constructor(private _columns: LayoutColumn[]) {
    }

    public get height(): number {
        return Math.max(...this._columns.map(column => column.height));
    }

    public move(position: LayoutPosition) {
        const shortest = ShortestColumn(this._columns);
        this.snapshots.push(shortest.move(position));
    }
}
