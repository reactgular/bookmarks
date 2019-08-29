import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {AppSearchAction} from '../../../states/app/app-search.action';
import {SelectionsState} from '../../../states/editor/selections/selections.state';

@Component({
    selector: 'tag-general-search',
    templateUrl: './general-search.component.html',
    styleUrls: ['./general-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralSearchComponent implements OnInit {
    public iconTimes = faTimes;

    @ViewChild('input', {read: ElementRef, static: true})
    public inputEl: ElementRef<HTMLInputElement>;

    @Select(SelectionsState.someSelected)
    public someSelected$: Observable<boolean>;

    public constructor(private _store: Store) {

    }

    public close() {
        this._store.dispatch(new AppSearchAction(false));
    }

    public ngOnInit(): void {
        setTimeout(() => this.inputEl.nativeElement.focus());
    }
}
