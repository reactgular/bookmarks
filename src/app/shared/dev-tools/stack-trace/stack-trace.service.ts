import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StackTraceService {
    // noinspection JSMethodCanBeStatic
    public trace(err?: Error): string[] | undefined {
        const ex = err || new Error();
        if (typeof ex === 'object' && typeof ex['stack'] === 'string') {
            return ex['stack'].split('\n');
        }
        return void 0;
    }
}
