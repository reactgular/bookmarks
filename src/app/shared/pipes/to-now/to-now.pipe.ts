import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'toNow', pure: false})
export class ToNowPipe implements PipeTransform {
    public transform(value: any, withoutSuffix?: boolean): any {
        return moment(value).toNow(withoutSuffix);
    }
}
