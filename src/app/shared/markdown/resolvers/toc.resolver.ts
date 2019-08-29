import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, shareReplay} from 'rxjs/operators';
import {TocEntry} from '../markdown-types';

@Injectable({providedIn: 'root'})
export class TocResolver implements Resolve<TocEntry[]> {
    private readonly _toc$: Observable<TocEntry[]>;

    public constructor(private _httpClient: HttpClient) {
        this._toc$ = this._httpClient.get<TocEntry[]>(`/assets/help/toc.json`).pipe(
            shareReplay(1),
            catchError(() => of(undefined))
        );
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TocEntry[]> {
        return this._toc$;
    }
}
