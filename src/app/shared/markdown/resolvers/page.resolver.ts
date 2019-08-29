import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map, shareReplay} from 'rxjs/operators';
import {MarkdownPage} from '../markdown-types';

@Injectable({providedIn: 'root'})
export class PageResolver implements Resolve<MarkdownPage> {
    private readonly _pages: Map<string, Observable<MarkdownPage>> = new Map();

    public constructor(private _httpClient: HttpClient) {

    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MarkdownPage> {
        const pageId = route.paramMap.get('page') || 'introduction';
        if (!this._pages.has(pageId)) {
            const page$ = this._httpClient.get(`/assets/help/${pageId}.md`, {responseType: 'text'}).pipe(
                map(markdown => ({pageId, markdown})),
                shareReplay(1),
                catchError(() => of(undefined))
            );
            this._pages.set(pageId, page$);
        }
        return this._pages.get(pageId);
    }
}
