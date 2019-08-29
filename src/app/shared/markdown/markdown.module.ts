import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ChapterNavComponent} from './chapter-nav/chapter-nav.component';
import {MarkdownComponent} from './markdown/markdown.component';
import {TocComponent} from './toc/toc.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        FontAwesomeModule
    ],
    declarations: [
        ChapterNavComponent,
        MarkdownComponent,
        TocComponent
    ],
    exports: [
        ChapterNavComponent,
        MarkdownComponent,
        TocComponent
    ]
})
export class MarkdownModule {
}
