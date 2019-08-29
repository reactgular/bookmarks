import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {Select, Store} from '@ngxs/store';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter, first, mapTo, takeUntil} from 'rxjs/operators';
import {KeyboardService} from '../../../shared/dev-tools/keyboard/keyboard.service';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {HotKeysService} from '../../../shared/hot-keys/hot-keys/hot-keys.service';
import {DocumentEntity} from '../../../shared/networks/entities/document.entity';
import {AppState} from '../../../states/app/app.state';
import {EditorState} from '../../../states/editor/editor.state';
import {AppHtmlMeta} from '../../../states/models/app-model';
import {DocumentsPatchAction} from '../../../states/storage/documents/documents-patch.action';

@Component({
    selector: 'tag-general-title',
    templateUrl: './general-title.component.html',
    styleUrls: ['./general-title.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralTitleComponent implements OnInit, OnDestroy {
    @Select(EditorState.document)
    public document$: Observable<DocumentEntity>;

    public edit$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public group: FormGroup;

    public iconTimes = faTimes;

    @ViewChild('input', {read: ElementRef, static: false})
    public inputEl: ElementRef<HTMLInputElement>;

    @Select(AppState.meta)
    public meta$: Observable<AppHtmlMeta>;

    public titleControl: FormControl;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _keyboard: KeyboardService,
                       private _hotKey: HotKeysService,
                       fb: FormBuilder,
                       log: LogService) {
        this._log = log.withPrefix(GeneralTitleComponent.name);
        this.titleControl = fb.control('', [Validators.required]);
        this.group = fb.group({title: this.titleControl});
    }

    public close(cancel?: boolean) {
        this.edit$.next(false);
        if (cancel) {
            return;
        }
        const title = (this.titleControl.value || '').trim();
        this.document$.pipe(
            first(),
            filter((document: DocumentEntity) => document.title !== title)
        ).subscribe(({id}: DocumentEntity) => this._store.dispatch(new DocumentsPatchAction(id, {title})));
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this._keyboard.esc$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => this.close(true));
    }

    public open() {
        this.document$.pipe(
            first(),
            filter(Boolean)
        ).subscribe((document: DocumentEntity) => {
            this.titleControl.setValue(document.title);
            this.edit$.next(true);
            this._hotKey.disabledUntil(this.edit$.pipe(
                filter(value => value === false),
                mapTo(undefined)
            ));
            setTimeout(() => this.inputEl.nativeElement.focus());
        });
    }
}
