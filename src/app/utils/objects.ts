export class Objects {
    public static set<TType>(obj: TType, key: string, value: any): TType {
        obj[key] = value;
        return obj;
    }
}
