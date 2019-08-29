import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {WINDOW} from '../window-token';

@Injectable({providedIn: 'root'})
export class TimeoutService {

    public constructor(@Inject(WINDOW) private _wnd: Window) {
    }

    public run(timeout?: number): Observable<void> {
        return new Observable(subscriber => {
            this._wnd.setTimeout(() => {
                subscriber.next();
                subscriber.complete();
            }, timeout);
        });
    }
}
