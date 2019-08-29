import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'fromNow', pure: false})
export class FromNowPipe implements PipeTransform {
    public transform(value: any, withoutSuffix?: boolean): any {
        return moment(value).fromNow(withoutSuffix);
    }
}
