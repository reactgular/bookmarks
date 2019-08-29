import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {faKeyboard} from '@fortawesome/free-solid-svg-icons';
import {Subject} from 'rxjs';
import {DialogRef} from '../../dialogs/dialog-ref';
import {DIALOG_REF_TOKEN} from '../../dialogs/dialog-ref.token';
import {HOT_KEY_SECTIONS, HotKeySection} from '../hot-key-sections';
import {HotKeyDescription, HotKeySectionEnum} from '../hot-keys.types';
import {HotKeysService} from '../hot-keys/hot-keys.service';

@Component({
    selector: 'tag-hot-keys-dialog',
    templateUrl: './hot-keys-dialog.component.html',
    styleUrls: ['./hot-keys-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HotKeysDialogComponent implements OnInit, OnDestroy {
    public iconKeyboard = faKeyboard;

    public readonly sections: HotKeySection[];

    private readonly _destroyed$: Subject<void> = new Subject();

    public constructor(@Inject(DIALOG_REF_TOKEN) private _dialogRef: DialogRef<HotKeysDialogComponent, any>,
                       private _hotKeys: HotKeysService) {
        const descriptions = this._hotKeys
            .getTools()
            .map(tool => tool.hotKey)
            .filter(desc => desc.hidden !== true);

        this.sections = HOT_KEY_SECTIONS.map(section => {
            return {
                ...section,
                descriptions: descriptions.filter(desc => (desc.section || HotKeySectionEnum.GENERAL) === section.type)
            } as HotKeySection;
        });
    }

    public close() {
        this._dialogRef.close();
    }

    public getCode(desc: HotKeyDescription) {
        const code = desc.humanCode || desc.code;
        return code
            .trim()
            .toUpperCase()
            .replace(/CTRL/g, 'Control')
            .replace(/DEL/g, 'Delete')
            .replace(/INS/g, 'Insert')
            .replace(/\s/g, '')
            .replace(/\+/g, ' + ')
            .replace(/,/g, ' / ')
            .replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()));
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this._hotKeys.disabledUntil(this._destroyed$);
    }
}
