import {Observable, OperatorFunction} from 'rxjs';
import {map} from 'rxjs/operators';

export function jsonParse<T>(): OperatorFunction<string, T> {
    return function (source: Observable<string>): Observable<T> {
        return source.pipe(map((value) => JSON.parse(value)));
    };
}
