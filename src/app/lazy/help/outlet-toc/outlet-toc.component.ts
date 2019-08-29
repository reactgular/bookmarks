import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {MarkdownBookService} from '../../../shared/markdown/markdown-book/markdown-book.service';
import {TocEntry} from '../../../shared/markdown/markdown-types';
import {AppMetaAction} from '../../../states/app/app-meta.action';

/**
 * Layouts the page for a TOC on the left and a chapter on the right.
 */
@Component({
    selector: 'rg-outlet-toc',
    templateUrl: './outlet-toc.component.html',
    styleUrls: ['./outlet-toc.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [
        MarkdownBookService
    ]
})
export class OutletTocComponent implements OnInit, OnDestroy {
    /**
     * Emits the currently active chapter in the TOC
     */
    public current$: Observable<TocEntry>;

    /**
     * Emits the TOC
     */
    public toc$: Observable<TocEntry[]>;

    /**
     * Destructor
     */
    private readonly _destroyed$: Subject<void> = new Subject();

    /**
     * Constructor
     */
    public constructor(private _store: Store,
                       private _activatedRoute: ActivatedRoute,
                       private _markdownBook: MarkdownBookService) {
    }

    /**
     * Destructor
     */
    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    /**
     * Initialize
     */
    public ngOnInit(): void {
        this.toc$ = this._markdownBook.toc();
        this.current$ = this._markdownBook.current();

        this._activatedRoute.data.pipe(
            map((data) => data.toc),
            takeUntil(this._destroyed$)
        ).subscribe(toc => this._markdownBook.setToc(toc));

        this._markdownBook.current().pipe(
            takeUntil(this._destroyed$)
        ).subscribe((chapter: TocEntry) => this._store.dispatch(new AppMetaAction({title: chapter ? chapter.title : 'Page Not Found'})));
    }
}
