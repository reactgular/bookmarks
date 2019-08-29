export interface StorageService {
    clear();

    get<TType>(key: string): TType;

    has(key: string): boolean;

    remove(key: string): boolean;

    set(key: string, value: any): boolean;
}
