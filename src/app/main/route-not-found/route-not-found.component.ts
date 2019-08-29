import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {AppMetaAction} from '../../states/app/app-meta.action';

@Component({
    selector: 'tag-route-not-found',
    templateUrl: './route-not-found.component.html',
    styleUrls: ['./route-not-found.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteNotFoundComponent implements OnInit {
    public constructor(private _store: Store) {

    }

    public ngOnInit(): void {
        this._store.dispatch(new AppMetaAction({title: 'Page Not Found'}));
    }
}
