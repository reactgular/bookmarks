import {Point} from '../../../utils/shapes/point';
import {LayoutColumn} from './layout-column';
import {LayoutConstraint} from './layout-constraint';

export class LayoutAlgorithm {
    private readonly _columnCount: number;

    public constructor(public readonly parentWidth: number,
                       public readonly columnWidth: number,
                       public readonly gutter: number) {
        this._columnCount = Math.floor(Math.max(1, parentWidth / columnWidth));
    }

    public constraint(offset: Point): LayoutConstraint {
        const width = (this.parentWidth + this.gutter) / this._columnCount;
        const columns: LayoutColumn[] = [];
        for (let n = 0; n < this._columnCount; n++) {
            columns.push(new LayoutColumn(
                n * width,
                width - this.gutter,
                offset,
                this.gutter
            ));
        }
        return new LayoutConstraint(columns);
    }

    public toString(): string {
        return `${this.parentWidth}, ${this.columnWidth}, ${this.gutter}`;
    }
}
