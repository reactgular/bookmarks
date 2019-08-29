import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Navigate} from '@ngxs/router-plugin';
import {Store} from '@ngxs/store';
import {BehaviorSubject, Subject} from 'rxjs';
import {merge} from 'rxjs/internal/observable/merge';
import {takeUntil} from 'rxjs/operators';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {FeatureLoaderState} from '../../../shared/loaders/feature-loader-types';
import {TemplateEntity} from '../../../shared/networks/entities/template.entity';
import {AppMetaAction} from '../../../states/app/app-meta.action';
import {DocumentsAddAction} from '../../../states/storage/documents/documents-add.action';
import {TemplatesService} from '../../../shared/templates-creator/templates/templates.service';

@Component({
    selector: 'tag-outlet-templates',
    templateUrl: './outlet-templates.component.html',
    styleUrls: ['./outlet-templates.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletTemplatesComponent implements OnInit, OnDestroy {
    public loader$: BehaviorSubject<FeatureLoaderState> = new BehaviorSubject(null);

    public templates$: BehaviorSubject<TemplateEntity[]> = new BehaviorSubject([]);

    private readonly _cancel$: Subject<void> = new Subject();

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _templates: TemplatesService,
                       private _activatedRoute: ActivatedRoute,
                       log: LogService) {
        this._log = log.withPrefix(OutletTemplatesComponent.name);
    }

    public load() {
        this.loader$.next({type: 'busy'});
        this.templates$.next([]);
        this._cancel$.next();

        this._templates.templates$.pipe(
            takeUntil(merge(this._cancel$, this._destroyed$))
        ).subscribe(templates => {
            this.loader$.next(null);
            this.templates$.next(templates);
        }, () => {
            this.loader$.next({type: 'error', canRetry: true, message: 'Could not load templates'});
        });
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this._store.dispatch(new AppMetaAction({title: 'Create Document'}));
        this.load();
    }

    public select(template?: TemplateEntity) {
        this.loader$.next({type: 'busy'});
        this._cancel$.next();

        this._templates.create(template && (template.id + '')).pipe(
            takeUntil(merge(this._cancel$, this._destroyed$))
        ).subscribe(doc => {
            this._store.dispatch([
                new DocumentsAddAction(doc),
                new Navigate([`/bookmarks/${doc.id}`])
            ]);
        }, () => {
            this.loader$.next({type: 'error', canRetry: true, message: 'Could not create document. Try disabling ad-blockers.'});
        });
    }
}
