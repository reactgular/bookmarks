import {Pipe, PipeTransform} from '@angular/core';

const allowedSuffix = ['.', ',', '!', '?'];

@Pipe({name: 'suffixPeriod'})
export class SuffixPeriodPipe implements PipeTransform {
    public transform(value: string): any {
        const str = (value + '').trim();
        if (!str.length) {
            return value;
        }
        const suffix = str[str.length - 1];
        if (allowedSuffix.indexOf(suffix) !== -1) {
            return str;
        }
        return str + '.';
    }
}
