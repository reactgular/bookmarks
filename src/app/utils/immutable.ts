import {Objects} from './objects';

export type ImmutableMutatorFunc<TObj> = (obj: TObj) => TObj;
export type ImmutableCloneType = Object | Array<any> | Date | Map<any, any>;

export interface ImmutableDataMap {
    [key: string]: any;
}

export class Immutable {

    public static EmptyArray: any[] = Immutable.freeze([]);

    /**
     * Appends an item to a frozen array.
     */
    public static append<TObj extends ImmutableCloneType>(items: TObj[], item: TObj): TObj[] {
        const mutable = items.slice();
        mutable.push(item);
        return Immutable.freeze(mutable);
    }

    /**
     * Clones an object, array or Date. The new clone is not frozen.
     */
    public static clone<T extends ImmutableCloneType>(value: T): T {
        if (value === undefined || value === null) {
            return value;
        }
        if (value instanceof Date) {
            return new Date((<Date>value).valueOf()) as T;
        }
        if (value instanceof Map) {
            return new Map(value) as T;
        }
        if (value instanceof Array) {
            return value.slice() as T;
        }
        if (typeof value === 'object') {
            const cloned = {} as T;
            Object.keys(value)
                .filter((key) => value.hasOwnProperty(key) && value[key] !== undefined)
                .forEach((key) => cloned[key] = value[key]);
            return cloned;
        }
        return value;
    }

    /**
     * Clones all the items in an array.
     */
    public static cloneAll<TObj extends ImmutableCloneType>(items: TObj[]): TObj[] {
        return items.map((item) => Immutable.clone(item));
    }

    /**
     * Recursively freezes an object and all of it's children.
     *
     * @see https://github.com/jsdf/deep-freeze
     */
    public static freeze<T>(value: T): T {
        Object.freeze(value);

        const valueIsFunction = typeof value === 'function';
        const hasOwnProp = Object.prototype.hasOwnProperty;

        Object.getOwnPropertyNames(value).forEach((prop) => {
            if (hasOwnProp.call(value, prop)
                && (valueIsFunction ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments' : true)
                && value[prop] !== null
                && (typeof value[prop] === 'object' || typeof value[prop] === 'function')
                && !Object.isFrozen(value[prop])) {
                Immutable.freeze(value[prop]);
            }
        });

        return value;
    }

    /**
     * Updates all the items in an array.
     */
    public static map<TObj extends ImmutableCloneType>(items: TObj[], mutator: ImmutableMutatorFunc<TObj>): TObj[] {
        return Immutable.freeze(items.map((item) => mutator(Immutable.clone(item))));
    }

    /**
     * Removes an item from the frozen array.
     */
    public static remove<TObj extends ImmutableCloneType>(items: TObj[], indx: number): TObj[] {
        if (indx < 0 || indx >= items.length) {
            throw new Error('Index out of range');
        }
        const mutable = items.slice();
        mutable.splice(indx, 1);
        return Immutable.freeze(mutable);
    }

    /**
     * Replaces an item in an array.
     */
    public static replace<TObj extends ImmutableCloneType>(items: TObj[], indx: number, item: TObj): TObj[] {
        if (indx < 0 || indx >= items.length) {
            throw new Error('Index out of range');
        }
        const mutable = items.slice();
        mutable.splice(indx, 1, item);
        return Immutable.freeze(mutable);
    }

    /**
     * Assigns a value to a property on a frozen object.
     */
    public static set<TObj extends ImmutableCloneType>(src: TObj, property: string, value: any): TObj {
        return Immutable.with(src, Objects.set({}, property, value));
    }


    /**
     * Unfreezes the value and calls the mutator function returning a frozen copy.
     * Works with objects and arrays.
     */
    public static update<TObj extends ImmutableCloneType>(src: TObj, mutator: ImmutableMutatorFunc<TObj>): TObj {
        return Immutable.freeze(mutator(Immutable.clone(src)));
    }

    /**
     * Applies a map of key/value pairs to a frozen object returning a new frozen object.
     */
    public static with<TObj extends ImmutableCloneType, TMapType = {}>(src: TObj, data: ImmutableDataMap | TMapType): TObj {
        const target = Immutable.clone(src);
        Object.keys(data)
            .filter((key) => data.hasOwnProperty(key))
            .forEach((key) => target[key] = data[key]);
        return Immutable.freeze(target);
    }
}
