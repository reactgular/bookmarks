import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {WINDOW} from '../../dev-tools/window-token';
import {BookModule, MarkdownPage, TocEntry} from '../markdown-types';

/**
 * A service which contains the state of an entire book. The service is not provided by the module directly, and consumers need
 * to provide it at a higher level. This allows an application to support more than one book. You can do this by defining it
 * in a view provider of a higher component.
 */
@Injectable()
export class MarkdownBookService {
    /**
     * The internal state of the service.
     */
    private readonly _state$: BehaviorSubject<BookModule> = new BehaviorSubject<BookModule>({
        page: null,
        toc: []
    });

    /**
     * Constructor
     */
    public constructor(@Inject(WINDOW) private _wnd: Window) {

    }

    /**
     * Emits the current TOC chapter.
     */
    public current(): Observable<TocEntry> {
        return this.currentIndx().pipe(
            map(value => value ? value.toc[value.indx] : undefined),
            distinctUntilChanged()
        );
    }

    /**
     * Emits the index in the TOC of the current chapter.
     */
    public currentIndx(): Observable<{ indx: number, toc: TocEntry[] }> {
        return this._state$.pipe(
            map(state => {
                if (!state.page || !state.toc) {
                    return undefined;
                }
                const indx = state.toc.findIndex(chapter => chapter.pageId === state.page.pageId);
                return indx === -1 ? undefined : {indx, toc: state.toc};
            }),
            distinctUntilChanged()
        );
    }

    /**
     * Emits the next chapter relative to the current chapter.
     */
    public next(): Observable<TocEntry> {
        return this.currentIndx().pipe(
            map(value => value && value.indx < value.toc.length - 1 ? value.toc[value.indx + 1] : undefined),
            distinctUntilChanged()
        );
    }

    /**
     * Emits the currently loaded page contents.
     */
    public page(): Observable<MarkdownPage> {
        return this._state$.pipe(
            map(state => state.page),
            distinctUntilChanged()
        );
    }

    /**
     * Emits the previous chapter relative to the current chapter.
     */
    public previous(): Observable<TocEntry> {
        return this.currentIndx().pipe(
            map(value => value && value.indx > 0 ? value.toc[value.indx - 1] : undefined),
            distinctUntilChanged()
        );
    }

    /**
     * Sets the current page contents.
     */
    public setPage(page: MarkdownPage) {
        this._patch({page});
    }

    /**
     * Sets the TOC collection.
     */
    public setToc(toc: TocEntry[]) {
        this._patch({toc: toc.map(value => Object.freeze(value))});
    }

    /**
     * Emits the TOC contents.
     */
    public toc(): Observable<TocEntry[]> {
        return this._state$.pipe(
            map(state => state.toc),
            distinctUntilChanged()
        );
    }

    private _patch(model: Partial<BookModule>) {
        this._state$.next(Object.freeze(Object.assign({...this._state$.getValue()}, model)));
    }
}
