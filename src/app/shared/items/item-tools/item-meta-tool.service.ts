import {ElementRef, Injectable, OnDestroy, ViewContainerRef} from '@angular/core';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {BehaviorSubject, merge, Observable, of, ReplaySubject, Subject} from 'rxjs';
import {delay, distinctUntilChanged, filter, first, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ApiResponse} from '../../api/api.types';
import {MetaService} from '../../api/meta/meta.service';
import {MetaEntity} from '../../networks/entities/meta.entity';
import {ReactiveTool, ReactiveToolAnimate, ReactiveToolDisabled, ReactiveToolStyle} from '../../reactive-tools/reactive-tool';
import {
    META_TOOL_CONTENT_TYPE,
    META_TOOL_DEFAULT,
    META_TOOL_ERROR,
    META_TOOL_FETCHING,
    META_TOOL_NO_TITLE,
    META_TOOL_SUCCESS,
    MetaToolData,
    MetaToolState
} from '../meta-tool-types';
import {ItemContext} from './item-context';

@Injectable()
export class ItemMetaToolService implements ReactiveTool, ReactiveToolDisabled, ReactiveToolStyle, ReactiveToolAnimate, OnDestroy {
    public readonly order: string = 'item:meta';

    private readonly _beforeTrigger$: Subject<void> = new Subject();

    private _busy: boolean = false;

    private readonly _cancel$: Subject<void> = new Subject();

    private readonly _data$: Subject<MetaToolData> = new Subject();

    private readonly _destroyed$: Subject<void> = new Subject();

    private _disabled: boolean = false;

    private readonly _state$: BehaviorSubject<MetaToolState> = new BehaviorSubject(META_TOOL_DEFAULT);

    private _url$: ReplaySubject<string> = new ReplaySubject(1);

    public constructor(private _meta: MetaService) {
    }

    public animate(): Observable<string> {
        return this._state$.pipe(
            map(state => state.icon === faSpinner ? 'pulse' : undefined),
            distinctUntilChanged()
        );
    }

    public beforeTrigger(): Observable<void> {
        return this._beforeTrigger$;
    }

    public cancel() {
        this._cancel$.next();
    }

    public color(): Observable<'success' | 'warning' | 'danger' | 'info' | void> {
        return this._state$.pipe(
            map(state => state.color),
            distinctUntilChanged()
        );
    }

    public disabled(): Observable<boolean> {
        return this._state$.pipe(
            map(state => state.disabled),
            distinctUntilChanged()
        );
    }

    public fetchMeta() {
        this._beforeTrigger$.next();

        if (this._disabled || this._busy) {
            return;
        }

        this._busy = true;
        this._state$.next(META_TOOL_FETCHING);

        this._url$.pipe(
            filter(Boolean),
            first(),
            switchMap(url => this._meta.fetch(url)),
            tap((resp: ApiResponse<MetaEntity>) => {
                if (resp && resp.status === 'success') {
                    const meta = resp.data;
                    if (meta.html) {
                        this._state$.next(meta.title ? META_TOOL_SUCCESS : META_TOOL_NO_TITLE);
                    } else {
                        this._state$.next(META_TOOL_CONTENT_TYPE);
                    }
                    this._data$.next({success: true, title: meta.title || undefined, image: meta.image || undefined});
                } else {
                    this._state$.next(META_TOOL_ERROR);
                    this._data$.next({success: false});
                }
            }),
            delay(5000),
            takeUntil(merge(this._cancel$, this._destroyed$))
        ).subscribe(() => {
        }, () => {
            this._state$.next(META_TOOL_ERROR);
            this._data$.next({success: false});
        }, () => {
            this._state$.next(META_TOOL_DEFAULT);
            this._busy = false;
        });
    }

    public getData(): Observable<MetaToolData> {
        return this._data$;
    }

    public highlight(): Observable<boolean> {
        return of(false);
    }

    public icon(): Observable<any> {
        return this._state$.pipe(
            map(state => state.icon),
            distinctUntilChanged()
        );
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
        this._cancel$.complete();
        this._state$.complete();
        this._beforeTrigger$.complete();
        this._data$.complete();
    }

    public setDisabled(value: boolean) {
        this._disabled = value;
    }

    public setUrl(value: string) {
        this._url$.next(value);
    }

    public title(): Observable<string> {
        return this._state$.pipe(
            map(state => state.title),
            distinctUntilChanged()
        );
    }

    public toolTip(): Observable<string> {
        return this._state$.pipe(
            map(state => state.toolTip),
            distinctUntilChanged()
        );
    }

    public trigger() {
        this.fetchMeta();
    }
}
