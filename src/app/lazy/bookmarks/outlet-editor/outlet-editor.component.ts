import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {faBookmark, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import {Select, Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {filter, map, switchMap, takeUntil} from 'rxjs/operators';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {WINDOW} from '../../../shared/dev-tools/window-token';
import {DocumentEntity} from '../../../shared/networks/entities/document.entity';
import {AppMetaAction} from '../../../states/app/app-meta.action';
import {EditorSetDocumentAction} from '../../../states/editor/editor-set-document.action';
import {EditorState} from '../../../states/editor/editor.state';
import {DocumentsState} from '../../../states/storage/documents/documents.state';

@Component({
    selector: 'tag-outlet-editor',
    templateUrl: './outlet-editor.component.html',
    styleUrls: ['./outlet-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletEditorComponent implements OnInit, OnDestroy {
    @Select(EditorState.document)
    public document$: Observable<DocumentEntity>;

    public iconBookmark = faBookmark;

    public iconExclamation = faExclamationTriangle;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _activatedRoute: ActivatedRoute,
                       private _snackBar: MatSnackBar,
                       @Inject(WINDOW) private _wnd: Window,
                       log: LogService) {
        this._log = log.withPrefix(OutletEditorComponent.name);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this._activatedRoute.params.pipe(
            map(params => parseInt(params['documentId'] || '0', 10)),
            switchMap(document_id => this._store.select(DocumentsState.byId).pipe(map(selector => selector(document_id)))),
            filter(Boolean),
            takeUntil(this._destroyed$)
        ).subscribe((document: DocumentEntity) => this._store.dispatch(new EditorSetDocumentAction(document.id)));

        this._store.select(EditorState.document).pipe(
            filter(Boolean),
            map(doc => doc.title || 'Blank Document'),
            takeUntil(this._destroyed$)
        ).subscribe(title => this._store.dispatch(new AppMetaAction({title})));
    }
}
