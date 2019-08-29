import {CommonModule, TitleCasePipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {FromNowPipe} from './from-now/from-now.pipe';
import {ReversePipe} from './reverse/reverse.pipe';
import {ShortenUrlPipe} from './shorten-url/shorten-url.pipe';
import {ShortAgoPipe} from './show-ago/short-ago.pipe';
import {StringifyPipe} from './stringify/stringify.pipe';
import {SuffixPeriodPipe} from './suffex-period/suffex-period.pipe';
import {ToNowPipe} from './to-now/to-now.pipe';
import {UntitledPipe} from './untitled/untitled.pipe';

const PIPES = [
    FromNowPipe,
    ReversePipe,
    ShortenUrlPipe,
    ShortAgoPipe,
    StringifyPipe,
    SuffixPeriodPipe,
    ToNowPipe,
    UntitledPipe
];

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ...PIPES
    ],
    providers: [
        ...PIPES
    ],
    exports: [
        ...PIPES
    ]
})
export class PipesModule {
}
