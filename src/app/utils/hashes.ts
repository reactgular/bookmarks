export namespace Hashes {
    function hashCode() {
        return Math.random().toString(36).substr(2).toUpperCase();
    }

    export function random(size: number = 3): string {
        return Array(size).fill(0).map(hashCode).join('');
    }
}
