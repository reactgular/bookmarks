export class Point {
    public constructor(public readonly x: number,
                       public readonly y: number) {
    }

    public static fromEvent(event: MouseEvent | Touch) {
        return new Point(event.clientX, event.clientY);
    }

    public add(p: Point): Point {
        return new Point(this.x + p.x, this.y + p.y);
    }

    public distance(point: Point): number {
        const a = this.x - point.x;
        const b = this.y - point.y;
        return Math.sqrt(a * a + b * b);
    }

    public divide(value: number): Point {
        return new Point(this.x / value, this.y / value);
    }

    public multi(value: number): Point {
        return new Point(this.x * value, this.y * value);
    }

    public subtract(p: Point): Point {
        return new Point(this.x - p.x, this.y - p.y);
    }

    public toString(): string {
        return `x:${this.x}, y:${this.y}`;
    }
}
