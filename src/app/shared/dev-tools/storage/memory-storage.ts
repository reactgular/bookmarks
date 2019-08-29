import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';

/**
 * This is a mock service used to test features that depend upon StorageService.
 */
@Injectable()
export class MemoryStorage implements StorageService {
    private storage: Map<string, any> = new Map();

    public clear() {
        this.storage.clear();
    }

    public get<TType>(key: string): TType {
        return this.storage.get(key) as TType;
    }

    public has(key: string): boolean {
        return this.storage.has(key);
    }

    public remove(key: string): boolean {
        return this.storage.delete(key);
    }

    public set(key: string, value: any): boolean {
        this.storage.set(key, value);
        return true;
    }

}
