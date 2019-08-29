import {Attribute, ChangeDetectionStrategy, Component, ElementRef, Input, QueryList, ViewChildren, ViewContainerRef} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import {Observable, of} from 'rxjs';
import {LogService} from '../../dev-tools/log/log.service';
import {
    isReactiveToolAnimate,
    isReactiveToolDisabled,
    isReactiveToolStyle,
    isReactiveToolVisible,
    reactiveConfig,
    ReactiveTool
} from '../reactive-tool';
import {ReactiveToolMouse} from '../reactive-tool-context';

@Component({
    selector: 'tag-reactive-tool',
    templateUrl: './reactive-tool.component.html',
    styleUrls: ['./reactive-tool.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactiveToolComponent {
    public animate$: Observable<string>;

    public color$: Observable<'success' | 'warning' | 'danger' | 'info' | void>;

    public disabled$: Observable<boolean>;

    public highlight$: Observable<boolean>;

    @Input()
    public icon: boolean = true;

    public icon$: Observable<string>;

    @ViewChildren(MatTooltip)
    public matTooltips: QueryList<MatTooltip>;

    @Input()
    public muted: boolean;

    @Input()
    public title: boolean = true;

    public title$: Observable<string>;

    public toolTip$: Observable<string>;

    public visible$: Observable<boolean>;

    private readonly _log: LogService;

    public constructor(private readonly _view: ViewContainerRef,
                       private readonly _el: ElementRef<HTMLElement>,
                       @Attribute('mode') public mode: 'icon' | 'button' | 'menu',
                       log: LogService) {
        this._log = log.withPrefix(ReactiveToolComponent.name);
        this.mode = this.mode || 'icon';
    }

    private _tool: ReactiveTool;

    @Input()
    public set tool(tool: ReactiveTool) {
        this._tool = tool;
        this.icon$ = tool.icon();
        this.toolTip$ = tool.toolTip();
        this.title$ = tool.title();
        this.animate$ = isReactiveToolAnimate(tool) ? <Observable<string>>tool.animate() : undefined;
        this.color$ = isReactiveToolStyle(tool) ? tool.color() : undefined;
        this.highlight$ = isReactiveToolStyle(tool) ? tool.highlight() : undefined;
        this.disabled$ = isReactiveToolDisabled(tool) ? tool.disabled() : of(false);
        this.visible$ = isReactiveToolVisible(tool) ? tool.visible() : of(true);
    }

    public mouseDown(event: MouseEvent) {
        const config = reactiveConfig(this._tool);
        if (config.down) {
            this._tool.trigger(this.getContext(event, 'down'));
        }
    }

    public mouseUp(event: MouseEvent) {
        const config = reactiveConfig(this._tool);
        if (config.up) {
            this._tool.trigger(this.getContext(event, 'up'));
        }
    }

    private getContext(event: MouseEvent, when: 'down' | 'up'): ReactiveToolMouse {
        this.matTooltips.forEach(tip => tip.hide());
        return {type: 'mouse', event, el: this._el, view: this._view, when};
    }
}
