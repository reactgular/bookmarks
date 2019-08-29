export class Collections {
    public static array<TType>(size: number, factory: (indx: number) => any): TType[] {
        return Array(size).fill(null).map((v, indx: number) => factory(indx));
    }

    public static numbers(size: number, startFrom: number = 0): number[] {
        return Collections.array(size, (indx) => startFrom + indx);
    }
}
