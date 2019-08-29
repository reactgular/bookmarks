import {ChangeDetectionStrategy, Component, Input, Output} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {filter, map, mapTo} from 'rxjs/operators';
import {LogService} from '../../dev-tools/log/log.service';
import {ReactiveOrderPipe} from '../reactive-order/reactive-order.pipe';
import {isReactiveToolStyle, ReactiveTool, ReactiveToolStyle} from '../reactive-tool';

@Component({
    selector: 'tag-reactive-ribbon',
    templateUrl: './reactive-ribbon.component.html',
    styleUrls: ['./reactive-ribbon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactiveRibbonComponent {
    @Input()
    public limit: number = 5;

    public menu$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    @Output()
    public menuClosed: Observable<void>;

    public menuMuted$: Observable<boolean>;

    @Output()
    public menuOpened: Observable<void>;

    public muted$: Observable<boolean>[];

    private readonly _log: LogService;

    public constructor(private _reactiveOrderPipe: ReactiveOrderPipe,
                       log: LogService) {
        this._log = log.withPrefix(ReactiveRibbonComponent.name);
        this.menuOpened = this.menu$.pipe(filter(value => value), mapTo(undefined));
        this.menuClosed = this.menu$.pipe(filter(value => !value), mapTo(undefined));
    }

    private _tools: ReactiveTool[];

    public get tools(): ReactiveTool[] {
        return this._tools;
    }

    @Input()
    public set tools(tools: ReactiveTool[]) {
        this._tools = this._reactiveOrderPipe.transform(tools);

        const highlights = (<any[]>this._tools)
            .filter(tool => isReactiveToolStyle(tool))
            .map((tool: ReactiveToolStyle) => tool.highlight());

        const anyHighlighted$ = combineLatest([...highlights, this.menu$]).pipe(map(values => values.some(Boolean)));

        this.muted$ = this._tools.map(tool => {
            if (isReactiveToolStyle(tool)) {
                return combineLatest([tool.highlight(), anyHighlighted$])
                    .pipe(map(([highlight, anyHighlighted]) => !highlight && anyHighlighted));
            }
            return anyHighlighted$;
        });

        this.menuMuted$ = combineLatest([anyHighlighted$, this.menu$])
            .pipe(map(([anyHighlighted, menu]) => anyHighlighted && !menu));
    }
}
