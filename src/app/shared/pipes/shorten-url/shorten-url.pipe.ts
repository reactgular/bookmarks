import {Pipe, PipeTransform} from '@angular/core';

const HTTP_PROTOCOL = /^https?:\/\//i;

@Pipe({name: 'shortenUrl', pure: true})
export class ShortenUrlPipe implements PipeTransform {
    public transform(value: string | any): any {
        if (typeof value === 'string' && HTTP_PROTOCOL.test(value)) {
            value = value.replace(HTTP_PROTOCOL, '');
            // remove trailing slash if it's the only slash
            if (value.endsWith('/')) {
                value = value.substring(0, value.length - 1);
            }
            if (value.startsWith('www.')) {
                value = value.substring(4);
            }
            return value;
        }
        return value;
    }
}
