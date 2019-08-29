import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {TocEntry} from '../markdown-types';

/**
 * Displays a table of contents and highlights chapters that are activated by the current route.
 */
@Component({
    selector: 'rg-toc',
    templateUrl: './toc.component.html',
    styleUrls: ['./toc.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TocComponent {
    /**
     * The active chapter in the TOC
     */
    @Input()
    public active: TocEntry;

    /**
     * Collection of table of contents.
     */
    @Input()
    public toc: TocEntry[];

    /**
     * Constructor
     */
    public constructor(private _router: Router) {

    }

    /**
     * Changes the route to the TOC chapter.
     */
    public activate(indx: number): Promise<boolean> {
        return this.toc[indx]
            ? this._router.navigateByUrl(this.toc[indx].route)
            : Promise.resolve(false);
    }
}
