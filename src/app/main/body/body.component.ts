import {DOCUMENT} from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {Router, RouterOutlet} from '@angular/router';
import {Store} from '@ngxs/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {LogService} from '../../shared/dev-tools/log/log.service';
import {WINDOW} from '../../shared/dev-tools/window-token';
import {AppState} from '../../states/app/app.state';

@Component({
    selector: 'tag-body',
    styleUrls: ['./body.component.scss'],
    templateUrl: './body.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyComponent implements OnInit, OnDestroy {
    @ViewChild(RouterOutlet, { static: true })
    public outlet: RouterOutlet;

    public stillBooting: boolean = true;

    private readonly _destroyed$: Subject<void> = new Subject<void>();

    private readonly _log: LogService;

    public constructor(private _change: ChangeDetectorRef,
                       private _route: Router,
                       private _store: Store,
                       private _title: Title,
                       private _meta: Meta,
                       @Inject(DOCUMENT) private _doc: Document,
                       @Inject(WINDOW) private _wnd: Window,
                       log: LogService) {
        this._log = log.withPrefix(BodyComponent.name);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        if (this._doc) {
            this.stillBooting = Boolean(this._doc.querySelector('#bootstrap'));
            this._change.markForCheck();
        }

        this._store.select(AppState.meta).pipe(
            takeUntil(this._destroyed$)
        ).subscribe((appMeta) => {
            if (appMeta && appMeta.title) {
                this._title.setTitle(`${appMeta.title} | ${environment.brand}`);
            } else {
                this._title.setTitle(environment.brand);
            }
            this._meta.removeTag('name="description"');
            if (appMeta && appMeta.description) {
                this._meta.addTag({name: 'description', context: appMeta.description});
            }
        });

        this.outlet.activateEvents.pipe(
            takeUntil(this._destroyed$)
        ).subscribe(() => {
            const el = this._doc.querySelector('#bootstrap');
            if (el) {
                el.parentNode.removeChild(el);
            }
        });
    }
}
