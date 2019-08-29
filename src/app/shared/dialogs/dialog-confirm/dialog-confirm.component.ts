import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {DialogConfirmOptions} from '../dialog-confirm-options';
import {DIALOG_DATA_TOKEN} from '../dialog-data.token';
import {DialogRef} from '../dialog-ref';
import {DIALOG_REF_TOKEN} from '../dialog-ref.token';

@Component({
    selector: 'tag-dialog-confirm',
    templateUrl: './dialog-confirm.component.html',
    styleUrls: ['./dialog-confirm.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogConfirmComponent {
    public constructor(@Inject(DIALOG_DATA_TOKEN) public options: DialogConfirmOptions,
                       @Inject(DIALOG_REF_TOKEN) private _dialogRef: DialogRef<DialogConfirmComponent, boolean>) {
    }

    public close(cancel?: boolean) {
        this._dialogRef.close(Boolean(cancel));
    }
}
