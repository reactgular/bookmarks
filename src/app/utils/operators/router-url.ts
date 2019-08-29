import {merge, Observable, of} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {distinctUntilChanged, filter, map, shareReplay} from 'rxjs/operators';

/**
 * Creates an observable that emits the current URL.
 */
export function routerUrl(router: Router): Observable<string> {
    const currentUrl$ = of(router.routerState.snapshot.url);
    const nextUrl$ = router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        map((e: NavigationEnd) => e.url)
    );
    return merge(currentUrl$, nextUrl$).pipe(
        distinctUntilChanged(),
        shareReplay(1)
    );
}
