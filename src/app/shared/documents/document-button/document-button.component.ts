import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {combineLatest, merge, Observable, ReplaySubject, Subject} from 'rxjs';
import {distinctUntilChanged, filter, first, map, switchMap, takeUntil} from 'rxjs/operators';
import {EditorState} from '../../../states/editor/editor.state';
import {DocumentsState} from '../../../states/storage/documents/documents.state';
import {Point} from '../../../utils/shapes/point';
import {Rectangle} from '../../../utils/shapes/rectangle';
import {LogService} from '../../dev-tools/log/log.service';
import {DocumentEntity} from '../../networks/entities/document.entity';
import {EntityIdType} from '../../networks/networks.types';
import {ReactiveTool} from '../../reactive-tools/reactive-tool';
import {DocumentContext} from '../document-tools/document-context.service';
import {DOCUMENT_PROVIDERS, DOCUMENT_TOOLS} from '../document-tools/document-providers';

@Component({
    selector: 'tag-document-button',
    templateUrl: './document-button.component.html',
    styleUrls: ['./document-button.component.scss'],
    host: {
        '(click)': 'click($event)' as string,
        '[class.highlighted]': 'highlight',
        '[class.active]': 'active'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        DocumentContext,
        ...DOCUMENT_PROVIDERS
    ]
})
export class DocumentButtonComponent implements OnInit, OnDestroy {

    public active: boolean = false;

    public document$: Observable<DocumentEntity>;

    public highlight: boolean = false;

    private readonly _active$: Subject<void> = new Subject();

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _documentId$: ReplaySubject<EntityIdType> = new ReplaySubject(1);

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _router: Router,
                       private _change: ChangeDetectorRef,
                       public el: ElementRef<HTMLElement>,
                       @Inject(DOCUMENT_TOOLS) public tools: ReactiveTool[],
                       private _editContext: DocumentContext,
                       log: LogService) {
        this._log = log.withPrefix(DocumentButtonComponent.name);
    }

    @Input()
    public set documentId(documentId: EntityIdType) {
        this._documentId$.next(documentId);
    }

    public click(event: MouseEvent) {
        this.document$.pipe(first()).subscribe(doc => this._router.navigate([`/bookmarks/${doc.id}`]));
    }

    public getSize(): Point {
        const rect = Rectangle.fromRef(this.el);
        return new Point(rect.width, rect.height);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit() {
        this.document$ = this._documentId$.pipe(
            switchMap(documentId => this._store.select(DocumentsState.byId).pipe(map(selector => selector(documentId))))
        );

        combineLatest([
            this._documentId$,
            this._store.select(EditorState.documentId)
        ]).pipe(
            map(([documentId, editorId]) => documentId === editorId),
            takeUntil(this._destroyed$)
        ).subscribe(value => {
            this.highlight = value;
            this._change.markForCheck();
        });

        this._documentId$.pipe(
            takeUntil(this._destroyed$)
        ).subscribe(documentId => this._editContext.setDocumentId(documentId));

        const navigationEnd$ = this._router.events.pipe(filter(event => event instanceof NavigationEnd));

        merge(
            this._active$,
            this._documentId$,
            navigationEnd$
        ).pipe(
            switchMap(() => this._documentId$),
            map(document_id => this._router.isActive(`/bookmarks/${document_id}`, true)),
            distinctUntilChanged(),
            takeUntil(this._destroyed$)
        ).subscribe(value => {
            this.active = value;
            this._change.markForCheck();
        });

        this._active$.next();
    }
}
