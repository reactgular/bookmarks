/**
 * A general class to help with asserting values are as expected.
 */
export class Assert {
    /**
     * Throws error if value is undefined.
     */
    public static isDefined<TType>(value: TType, message?: string): TType {
        if (typeof value === 'undefined') {
            throw new Error(message || 'Value is undefined');
        }
        return value;
    }

    /**
     * Throws error if value is not false.
     */
    public static isFalse(value: boolean, message?: string): boolean {
        if (value !== false) {
            throw new Error(message || 'Value was not false');
        }
        return value;
    }

    /**
     * Throws error if value is falsy.
     */
    public static isFalsy<TType>(value: TType, message?: string): TType {
        if (Boolean(value) === false) {
            throw new Error(message || 'Value was false');
        }
        return value;
    }

    /**
     * Throws error if value is not false.
     */
    public static isTrue(value: boolean, message?: string): boolean {
        if (value !== true) {
            throw new Error(message || 'Value was not true');
        }
        return value;
    }

    /**
     * Throws error if value is true.
     */
    public static isTruthy<TType>(value: TType, message?: string): TType {
        if (Boolean(value) === true) {
            throw new Error(message || 'Value was false');
        }
        return value;
    }

    /**
     * Throws error if value is not undefined.
     */
    public static isUndefined<TType>(value: TType, message?: string): TType {
        if (typeof value !== 'undefined') {
            throw new Error(message || 'Value is not undefined');
        }
        return value;
    }
}
