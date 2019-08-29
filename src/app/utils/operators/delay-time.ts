import {MonoTypeOperatorFunction, Observable, of} from 'rxjs';
import {delay, mergeMap} from 'rxjs/operators';

/**
 * The delay operator uses a scheduler for emitting values, and it doesn't work the same
 * as calling `setTimeout(func, 0)` for zero values. This operators emits each value after
 * a delay, but if the time is zero it is emitted asynchronously
 */
export function delayTime<T>(timeout?: number): MonoTypeOperatorFunction<T> {
    return function (source: Observable<T>): Observable<T> {
        return timeout
            ? source.pipe(mergeMap(value => of(value).pipe(delay(timeout))))
            : new Observable(subscriber => source.subscribe(
                value => setTimeout(() => subscriber.next(value)),
                error => subscriber.error(error),
                () => subscriber.complete()
            ));
    };
}
