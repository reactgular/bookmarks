import {Injectable} from '@angular/core';
import {faArchive} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {HotKeyDescription, HotKeySectionEnum} from '../../../shared/hot-keys/hot-keys.types';
import {HotKeysService} from '../../../shared/hot-keys/hot-keys/hot-keys.service';
import {DocumentEntity} from '../../../shared/networks/entities/document.entity';
import {ReactiveAutoCloseService} from '../../../shared/reactive-tools/reactive-auto-close.service';
import {ReactiveToolConfig, ReactiveToolHotKey, ReactiveToolStyle} from '../../../shared/reactive-tools/reactive-tool';
import {DocumentsState} from '../../../states/storage/documents/documents.state';
import {EditorState} from '../../../states/editor/editor.state';
import {ARCHIVED_SIDE_BAR_TOKEN} from '../../archived/archived-side-bar.token';

@Injectable()
export class GeneralArchivedService extends ReactiveAutoCloseService implements ReactiveToolHotKey, ReactiveToolStyle {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0100:0200'
    };

    public readonly hotKey: HotKeyDescription = {
        code: 'ALT+A',
        message: 'Opens the documents archive',
        section: HotKeySectionEnum.GENERAL
    };

    public constructor(store: Store, hotKeys: HotKeysService) {
        super(store, hotKeys, ARCHIVED_SIDE_BAR_TOKEN);
    }

    public color(): Observable<'success' | 'warning' | 'danger' | 'info' | void> {
        return of(undefined);
    }

    public highlight(): Observable<boolean> {
        return this._store.select(EditorState.documentId).pipe(
            switchMap(documentId => {
                return documentId === null
                    ? of(false)
                    : this._store.select(DocumentsState.byId).pipe(
                        map(selector => selector(documentId)),
                        map((document: DocumentEntity) => document.archived)
                    );
            })
        );
    }

    public icon(): Observable<any> {
        return of(faArchive);
    }

    public title(): Observable<string> {
        return of('Archived');
    }
}
