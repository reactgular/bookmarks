import {ChangeDetectionStrategy, Component, Inject, OnDestroy} from '@angular/core';
import {Select} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {ReactiveTool} from '../../../shared/reactive-tools/reactive-tool';
import {AppState} from '../../../states/app/app.state';
import {GeneralHamburgerService} from '../general-tools/general-hamburger.service';
import {GENERAL_TOP_TOOLS} from '../general-tools/general-providers';

@Component({
    selector: 'tag-general-tool-bar',
    templateUrl: './general-tool-bar.component.html',
    styleUrls: ['./general-tool-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralToolBarComponent implements OnDestroy {
    @Select(AppState.search)
    public search$: Observable<boolean>;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(public hamburger: GeneralHamburgerService,
                       @Inject(GENERAL_TOP_TOOLS) public tools: ReactiveTool[],
                       log: LogService) {
        this._log = log.withPrefix(GeneralToolBarComponent.name);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
