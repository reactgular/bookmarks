import {ElementRef} from '@angular/core';
import {Point} from './point';

export class Rectangle {
    public constructor(public readonly x: number,
                       public readonly y: number,
                       public readonly width: number,
                       public readonly height: number) {
    }

    public static fromRect(rect: ClientRect | DOMRect) {
        return new Rectangle(rect.left, rect.top, rect.width, rect.height);
    }

    public static fromRef(el: ElementRef<HTMLElement>) {
        return Rectangle.fromRect(el.nativeElement.getBoundingClientRect());
    }

    public grow(value: number): Rectangle {
        return new Rectangle(
            this.x - value,
            this.y - value,
            this.width + value * 2,
            this.height + value * 2
        );
    }

    public inside(p: Point): boolean {
        return p.x >= this.x
            && p.x <= this.x + this.width
            && p.y >= this.y
            && p.y <= this.y + this.height;
    }

    public lowerLeft(): Point {
        return new Point(this.x, this.y + this.height);
    }

    public lowerRight(): Point {
        return new Point(this.x + this.width, this.y + this.height);
    }

    public move(p: Point): Rectangle {
        return new Rectangle(this.x + p.x, this.y + p.y, this.width, this.height);
    }

    public outside(p: Point): boolean {
        return !this.inside(p);
    }

    public points(): [Point, Point, Point, Point] {
        return [this.upperLeft(), this.upperRight(), this.lowerRight(), this.lowerLeft()];
    }

    public shrink(value: number): Rectangle {
        return this.grow(-value);
    }

    public split(horizontal: boolean): [Rectangle, Rectangle] {
        if (horizontal) {
            const half = this.height / 2;
            return [
                new Rectangle(this.x, this.y, this.width, half),
                new Rectangle(this.x, this.y + half, this.width, half)
            ];
        } else {
            const half = this.width / 2;
            return [
                new Rectangle(this.x, this.y, half, this.height),
                new Rectangle(this.x + half, this.y, half, this.height)
            ];
        }
    }

    public toString(): string {
        return `x:${this.x}, y:${this.y}, width:${this.width}, height:${this.height}`;
    }

    public upperLeft(): Point {
        return new Point(this.x, this.y);
    }

    public upperRight(): Point {
        return new Point(this.x + this.width, this.y);
    }
}
