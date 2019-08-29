import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {WINDOW} from '../../../shared/dev-tools/window-token';
import {MarkdownBookService} from '../../../shared/markdown/markdown-book/markdown-book.service';
import {MarkdownPage, TocEntry} from '../../../shared/markdown/markdown-types';
import {AppMetaAction} from '../../../states/app/app-meta.action';

@Component({
    selector: 'tag-outlet-help',
    templateUrl: './outlet-help.component.html',
    styleUrls: ['./outlet-help.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletHelpComponent implements OnInit, OnDestroy {
    public next$: Observable<TocEntry>;

    public page$: Observable<MarkdownPage>;

    public previous$: Observable<TocEntry>;

    private readonly _destroyed$: Subject<void> = new Subject();

    public constructor(@Inject(WINDOW) private _wnd: Window,
                       private _store: Store,
                       private _activatedRoute: ActivatedRoute,
                       private _markdownBook: MarkdownBookService) {
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this.page$ = this._markdownBook.page();
        this.previous$ = this._markdownBook.previous();
        this.next$ = this._markdownBook.next();

        this._activatedRoute.data.pipe(
            map((data) => data.page as MarkdownPage)
        ).pipe(
            takeUntil(this._destroyed$)
        ).subscribe(page => {
            if (!page) {
                this._store.dispatch(new AppMetaAction({title: 'Page Not Found'}));
            }
            // @bug
            // The TOC table was not updating, and I couldn't figure out way.
            // It has something to do with the service patching the state a synchronous call, and
            // parent components listening weren't updating their views. So a setTimeout resolves
            // the issue, but I don't like it. If this issue raises again the fix will have to be
            // made in the markdown service.
            this._wnd.setTimeout(() => {
                this._markdownBook.setPage(page);
            });
        });
    }
}
