import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {KeyboardService} from '../../dev-tools/keyboard/keyboard.service';
import {LogService} from '../../dev-tools/log/log.service';
import {ComponentCreatorDirective} from '../../ui/component-creator/component-creator.directive';
import {DialogRef} from '../dialog-ref';
import {DIALOG_REF_TOKEN} from '../dialog-ref.token';

@Component({
    selector: 'tag-modal-dialog',
    templateUrl: './modal-dialog.component.html',
    styleUrls: ['./modal-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalDialogComponent implements OnInit, OnDestroy {
    @ViewChild(ComponentCreatorDirective, { static: true })
    public componentCreator: ComponentCreatorDirective;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(@Inject(DIALOG_REF_TOKEN) private _dialogRef: DialogRef<any, any>,
                       private _keyboard: KeyboardService,
                       log: LogService) {
        this._log = log.withPrefix(ModalDialogComponent.name);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        const component = this.componentCreator.create(this._dialogRef.component);
        this._dialogRef.open(component);

        this._keyboard.esc$.pipe(
            takeUntil(this._destroyed$)
        ).subscribe(() => this._dialogRef.close());
    }
}
