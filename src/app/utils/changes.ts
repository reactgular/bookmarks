import {SimpleChange, SimpleChanges} from '@angular/core';

export type ChangeHandler<TType> = (newValue: TType, oldValue: TType, first: boolean) => void;

export class Changes {
    public static any(changes: SimpleChanges, names: string[], handler: (changes: SimpleChanges) => void): void {
        for (const name of names) {
            if (name in changes) {
                handler(changes);
                return;
            }
        }
    }

    /**
     * Calls the handler if the changes contains the name.
     */
    public static on<TType>(changes: SimpleChanges,
                            name: string,
                            handler: ChangeHandler<TType>): void {
        if (name in changes) {
            handler(changes[name].currentValue, changes[name].previousValue, changes[name].firstChange);
        }
    }

    /**
     * Calls the handler if changes contains any one of the names.
     */
    public static once<TType>(changes: SimpleChanges,
                              name: string,
                              handler: ChangeHandler<TType>): void {
        if (changes[name] && changes[name].firstChange) {
            Changes.on<TType>(changes, name, handler);
        }
    }

    /**
     * Updates a SimpleChanges object.
     */
    public static simple(propName: string, oldValue: any, newValue: any, changes?: SimpleChanges): SimpleChanges {
        changes = changes || {};
        changes[propName] = new SimpleChange(oldValue, newValue, false);
        return changes;
    }

    /**
     * Calls the watcher function and if it returns a non-undefined value the handler is executed.
     */
    public static watch<TType>(current: TType,
                               reader: (current: TType) => TType,
                               handler: ChangeHandler<TType>): TType {
        const value = reader(current);
        if (value !== current) {
            handler(value, current, typeof current === 'undefined');
        }
        return value;
    }
}
