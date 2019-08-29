export function AssertLoadedOnce(value) {
    if (value) {
        throw new Error('Module can only be loaded once in the main module');
    }
}
