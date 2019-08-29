import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {TocEntry} from '../markdown-types';

@Component({
    selector: 'rg-chapter-nav',
    templateUrl: './chapter-nav.component.html',
    styleUrls: ['./chapter-nav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.chapter-back]': 'back',
        '(click)': 'activate()'
    }
})
export class ChapterNavComponent {
    @Input()
    public back: boolean = false;

    @Input()
    public chapter: TocEntry;

    public faArrowLeft = faArrowLeft;

    public faArrowRight = faArrowRight;

    public constructor(private _router: Router) {

    }

    public activate() {
        if (this.chapter) {
            this._router.navigateByUrl(this.chapter.route);
        }
    }
}
