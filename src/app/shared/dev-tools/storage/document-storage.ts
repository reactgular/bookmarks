import {environment} from '../../../../environments/environment';
import {LogService} from '../log/log.service';
import {StorageService} from './storage.service';

export class DocumentService implements StorageService {
    private static prefix: string = environment.brand.toLowerCase();

    private readonly _log: LogService;

    public constructor(private readonly store: Storage,
                       log: LogService) {
        this._log = log.withPrefix(DocumentService.name);
        if (!this.store) {
            this._log.error('Warning: No localStorage engine.');
        }
    }

    private static toKey(key: string): string {
        return DocumentService.prefix + ':' + key;
    }

    public clear(): this {
        if (this.store) {
            this.store.clear();
        }
        return this;
    }

    public get<TType>(key: string): TType {
        if (!this.store) {
            return void (0);
        }
        const value = this.store.getItem(DocumentService.toKey(key));
        try {
            return JSON.parse(value) as TType;
        } catch (error) {
            this._log.error(error);
        }
        return void (0);
    }

    public has(key: string): boolean {
        if (!this.store) {
            return false;
        }
        key = DocumentService.toKey(key);
        for (let i = 0, c = this.store.length; i < c; i++) {
            if (this.store.key(i) === key) {
                return true;
            }
        }
        return false;
    }

    public remove(key: string): boolean {
        if (!this.store) {
            return false;
        }
        try {
            if (this.has(key)) {
                this.store.removeItem(DocumentService.toKey(key));
                return true;
            } else {
                this._log.debug('Key not found', key);
            }
        } catch (error) {
            this._log.error(error);
        }
        return false;
    }

    public set(key: string, value: any): boolean {
        if (!this.store) {
            return false;
        }
        try {
            this.store.setItem(DocumentService.toKey(key), JSON.stringify(value));
            return true;
        } catch (error) {
            this._log.error(error);
        }
        return false;
    }
}
