import {animate, style, transition, trigger} from '@angular/animations';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SideBarsToggleAction} from '../../../states/side-bars/side-bars-toggle.action';
import {KeyboardService} from '../../dev-tools/keyboard/keyboard.service';

@Component({
    selector: 'tag-side-bar-overlay',
    template: '',
    styleUrls: ['./side-bar-overlay.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[@fadeInOut]': 'true',
        '(click)': 'toggleSidebar()'
    },
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({opacity: 0}),
                animate('300ms ease-in-out', style({opacity: 1}))
            ]),
            transition(':leave', [
                style({opacity: 1}),
                animate('300ms ease-in-out', style({opacity: 0}))
            ])
        ])
    ]
})
export class SideBarOverlayComponent implements OnInit, OnDestroy {
    private readonly _destroyed$: Subject<void> = new Subject();

    public constructor(private _store: Store,
                       private _keyboard: KeyboardService) {
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this._keyboard.esc$.pipe(
            takeUntil(this._destroyed$)
        ).subscribe(() => this.toggleSidebar());
    }

    public toggleSidebar() {
        this._store.dispatch(new SideBarsToggleAction());
    }
}
