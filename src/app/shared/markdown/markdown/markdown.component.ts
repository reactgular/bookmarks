import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import * as marked from 'marked';
import {ReplaySubject} from 'rxjs';
import {MarkdownPage} from '../markdown-types';

@Component({
    selector: 'rg-markdown',
    templateUrl: './markdown.component.html',
    styleUrls: ['./markdown.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownComponent {
    public readonly markdown$: ReplaySubject<SafeHtml> = new ReplaySubject(1);

    public constructor(private _domSanitizer: DomSanitizer) {

    }

    @Input()
    public set markdown(page: MarkdownPage) {
        this.markdown$.next(this._domSanitizer.bypassSecurityTrustHtml(marked(page ? page.markdown : '')));
    }
}
