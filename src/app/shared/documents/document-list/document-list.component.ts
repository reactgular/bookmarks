import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {DocumentsSortAction} from '../../../states/storage/documents/documents-sort.action';
import {StorageState} from '../../../states/storage/storage.state';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-document-list',
    templateUrl: './document-list.component.html',
    styleUrls: ['./document-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.reactive-tool-side-bar]': 'true',
        '[class.reactive-tool-invert]': 'true'
    }
})
export class DocumentListComponent implements OnInit, OnChanges {
    @Input()
    public archived: boolean = false;

    public ids$: Observable<EntityIdType[]>;

    public constructor(private _store: Store) {
    }

    public drop(event: CdkDragDrop<EntityIdType[]>, ids: EntityIdType[]) {
        ids = ids.slice();
        moveItemInArray(ids, event.previousIndex, event.currentIndex);
        const document_ids = this.archived ? undefined : ids;
        const archive_ids = this.archived ? ids : undefined;
        this._store.dispatch(new DocumentsSortAction(document_ids, archive_ids));
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.update();
    }

    public ngOnInit(): void {
        this.update();
    }

    private update() {
        this.ids$ = this.archived
            ? this._store.select(StorageState.archiveIds)
            : this._store.select(StorageState.documentIds);
    }
}
