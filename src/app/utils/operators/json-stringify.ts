import {Observable, OperatorFunction} from 'rxjs';
import {map} from 'rxjs/operators';

export function jsonStringify<T>(): OperatorFunction<T, string> {
    return function (source: Observable<T>): Observable<string> {
        return source.pipe(map((value) => JSON.stringify(value)));
    };
}
