import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'shortAgo'})
export class ShortAgoPipe implements PipeTransform {
    public transform(value: any, args?: any): any {
        if (!value) {
            return value;
        }
        const m = moment(value);
        return m.isSame(new Date(), 'day') ? m.format('LT') : m.format('ll');
    }
}
