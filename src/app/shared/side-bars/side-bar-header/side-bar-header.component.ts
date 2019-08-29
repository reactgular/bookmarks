import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {SideBarsHeaderCloseAction} from '../../../states/side-bars/side-bars-header-close.action';

@Component({
    selector: 'tag-side-bar-header',
    templateUrl: './side-bar-header.component.html',
    styleUrls: ['./side-bar-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBarHeaderComponent {
    @Input()
    public closable: boolean = true;

    public iconTimes = faTimes;

    public constructor(private _store: Store) {
    }

    public close() {
        this._store.dispatch(new SideBarsHeaderCloseAction());
    }
}
