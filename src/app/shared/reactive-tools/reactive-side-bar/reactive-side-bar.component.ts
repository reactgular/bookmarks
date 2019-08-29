import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {reactiveConfig, ReactiveTool} from '../reactive-tool';

@Component({
    selector: 'tag-reactive-side-bar',
    templateUrl: './reactive-side-bar.component.html',
    styleUrls: ['./reactive-side-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.reactive-tool-side-bar]': 'true',
        '[class.reactive-tool-invert]': 'invert'
    }
})
export class ReactiveSideBarComponent {
    @Input()
    public invert: boolean = false;

    private _tools: ReactiveTool[];

    public get tools(): ReactiveTool[] {
        return this._tools;
    }

    @Input()
    public set tools(tools: ReactiveTool[]) {
        this._tools = tools || [];
        this._tools.sort((a, b) => {
            const A = reactiveConfig(a).order;
            const B = reactiveConfig(b).order;
            return A === B ? 0 : (A < B ? -1 : 1);
        });
    }

    public isSeparated(indx: number, tools: ReactiveTool[]) {
        if (indx === 0 || indx > tools.length - 1) {
            return false;
        }
        const previous = reactiveConfig(tools[indx - 1]).order.split(':');
        const current = reactiveConfig(tools[indx]).order.split(':');
        return previous[0] !== current[0];
    }
}
