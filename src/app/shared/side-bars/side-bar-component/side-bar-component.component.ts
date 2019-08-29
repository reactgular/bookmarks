import {animate, style, transition, trigger} from '@angular/animations';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, InjectFlags,
    InjectionToken,
    Injector,
    Input,
    OnInit,
    Type,
    ViewChild
} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {SideBarsPanelOverlayAction} from '../../../states/side-bars/side-bars-panel-overlay.action';
import {SideBarsState} from '../../../states/side-bars/side-bars.state';
import {LogService} from '../../dev-tools/log/log.service';
import {ComponentCreatorDirective} from '../../ui/component-creator/component-creator.directive';
import {isSideBarComponentStyle, SideBarBackground, SideBarComponentStyle} from '../side-bars.types';

@Component({
    selector: 'tag-side-bar-component',
    templateUrl: './side-bar-component.component.html',
    styleUrls: ['./side-bar-component.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.darker-background]': 'background === "darker"',
        '[class.dark-background]': 'background === "dark"',
        '[class.lite-background]': 'background === "lite"',
        '[class.liter-background]': 'background === "liter"',
        '[class.white-background]': 'background === "white"',
        '[@.disabled]': 'disableAnimation',
        '[@slide]': 'true',
        '(@slide.start)': 'showOverlay(true)',
        '(@slide.done)': 'showOverlay(false)',
    },
    animations: [
        trigger('slide', [
            transition(':enter', [
                style({'transform': 'translateX(-16rem)'}),
                animate('300ms ease-in-out', style({'transform': 'translateX(0)'}))
            ]),
            transition(':leave', [
                style({'transform': 'translateX(0)'}),
                animate('300ms ease-in-out', style({'transform': 'translateX(-16rem)'}))
            ])
        ])
    ]
})
export class SideBarComponentComponent implements OnInit {
    @ViewChild(ComponentCreatorDirective, { static: true })
    public componentCreator: ComponentCreatorDirective;

    public background: SideBarBackground = 'white';

    @Input()
    public disableAnimation: boolean;

    @Select(SideBarsState.panelOverlay)
    public panelOverlay$: Observable<boolean>;

    @Input()
    public token: InjectionToken<Type<any>>;

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _injector: Injector,
                       private _change: ChangeDetectorRef,
                       log: LogService) {
        this._log = log.withPrefix(SideBarComponentComponent.name);
    }

    public ngOnInit() {
        const componentType = this._injector.get(this.token, undefined, InjectFlags.Optional);
        if (!componentType) {
            throw new Error(`${this.token}: component not found`);
        }
        const componentStyle = this.componentCreator.create<SideBarComponentStyle>(componentType);
        if (isSideBarComponentStyle(componentStyle)) {
            this.background = componentStyle.getBackground();
        }
        this._change.markForCheck();
    }

    public showOverlay(value: boolean) {
        this._store.dispatch(new SideBarsPanelOverlayAction(value));
    }
}
