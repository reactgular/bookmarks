import {HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Navigate} from '@ngxs/router-plugin';
import {Store} from '@ngxs/store';
import {Observable, of, Subject} from 'rxjs';
import {catchError, first, timeout} from 'rxjs/operators';
import {TimeoutError} from 'rxjs/src/internal/util/TimeoutError';
import {environment} from '../../../../environments/environment';
import {LogService} from '../../dev-tools/log/log.service';
import {ApiResponse} from '../api.types';

const REQUEST_TIMEOUT = 30000;

@Injectable({providedIn: 'root'})
export class RestService implements OnDestroy {

    private readonly _destroyed$: Subject<void> = new Subject();

    private _headers: HttpHeaders;

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _httpClient: HttpClient,
                       private _snackBar: MatSnackBar,
                       log: LogService) {
        this._log = log.withPrefix(RestService.name);
        this._headers = new HttpHeaders({'Accept': 'application/json'});
    }

    public delete<TType>(resource: string, body?: any): Observable<ApiResponse<TType> | null> {
        return this.request('DELETE', resource, {body});
    }

    public get<TType>(resource: string, body?: any): Observable<ApiResponse<TType> | null> {
        return this.request('GET', resource, {body});
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public patch<TType>(resource: string, body?: any): Observable<ApiResponse<TType> | null> {
        return this.request('PATCH', resource, {body});
    }

    public post<TType>(resource: string, body?: any): Observable<ApiResponse<TType> | null> {
        return this.request('POST', resource, {body});
    }

    public request<TType>(method: string, resource: string, options?: any): Observable<ApiResponse<TType> | null> {
        options = Object.assign({}, options || {});
        options['headers'] = this.getHeaders(options['headers'] || {});
        return this._httpClient.request<TType>(method, `${environment.api}${resource}`, options)
            .pipe(
                timeout(REQUEST_TIMEOUT),
                first(),
                catchError((err: any, caught: Observable<HttpEvent<TType>>) => {
                    this._snackBar.open(this.getErrorMessage(err), 'Dismiss', {politeness: 'assertive'});
                    return of(null);
                })
            );
    }

    private getErrorMessage(err: any): string {
        if (err instanceof HttpErrorResponse) {
            return this.getHttpErrorMessage(err);
        } else {
            if ('name' in err && err.name === 'TimeoutError') {
                return 'Timeout making request to server.';
            }
            return 'An unknown error failed request to server.';
        }
    }

    private getHeaders(value?: any): HttpHeaders {
        if (!(value instanceof HttpHeaders)) {
            value = new HttpHeaders(value || {});
        }
        let headers = this._headers;
        value.keys().forEach((key: string) => {
            headers = headers.set(key, value.get(key));
        });
        return headers;
    }

    private getHttpErrorMessage(err: HttpErrorResponse): string {
        if (!err.status) {
            return 'Unable to connect to server.';
        } else if (err.status === 401) {
            this._store.dispatch(new Navigate(['/users/logout']));
            return 'Unauthorized request to server.';
        } else if (err.status <= 499) {
            return 'Client made bad request to server.';
        } else if (err.status === 503) {
            return 'Server is offline for maintenance.';
        } else if (err.status >= 500) {
            return 'Server is experiencing technical difficulties.';
        }
        return 'Server gave unexpected response.';
    }
}
