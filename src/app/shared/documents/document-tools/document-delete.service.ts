import {Injectable} from '@angular/core';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {Navigate} from '@ngxs/router-plugin';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {DocumentsDeleteAction} from '../../../states/storage/documents/documents-delete.action';
import {DialogsService} from '../../dialogs/dialogs/dialogs.service';
import {DocumentEntity} from '../../networks/entities/document.entity';
import {ReactiveTool, ReactiveToolConfig} from '../../reactive-tools/reactive-tool';
import {ReactiveToolContext} from '../../reactive-tools/reactive-tool-context';
import {DocumentContext} from './document-context.service';
import {StorageState} from '../../../states/storage/storage.state';
import {AppSequenceAction} from '../../../states/app/app-sequence.action';

@Injectable()
export class DocumentDeleteService implements ReactiveTool {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '9999:0300'
    };

    public constructor(private _store: Store,
                       private _context: DocumentContext,
                       private _dialog: DialogsService) {
    }

    public icon(): Observable<any> {
        return of(faTrash);
    }

    public title(): Observable<string> {
        return of('Delete');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger(context?: ReactiveToolContext) {
        this._context
            .getDocumentOnce()
            .subscribe((document: DocumentEntity) => this._confirm(document));
    }

    private _confirm({id, title}: DocumentEntity) {
        this._dialog.confirm({
            title: 'Delete document?',
            message: `Do you want to permanently delete the document titled: "${title || 'Untitled Document'}"`,
            icon: faTrash,
            okay: {
                title: 'Delete',
                color: 'warn'
            }
        }).pipe(
            filter(Boolean)
        ).subscribe(() => {
            this._store.selectOnce(StorageState.documentIds).pipe(
                map(documentIds => documentIds.filter(documentId => documentId !== id)),
                map(documentIds => documentIds.length ? documentIds[0] : undefined),
            ).subscribe(documentId => {
                const navigateAction = documentId ? new Navigate([`/bookmarks/${documentId}`]) : new Navigate(['/']);
                this._store.dispatch(new AppSequenceAction([
                    navigateAction,
                    new DocumentsDeleteAction(id)
                ]));
            });
        });
    }
}
