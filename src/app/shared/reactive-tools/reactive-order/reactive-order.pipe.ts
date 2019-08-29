import {Pipe, PipeTransform} from '@angular/core';
import {ReactiveTool} from '../reactive-tool';

@Pipe({name: 'reactiveOrder', pure: true})
export class ReactiveOrderPipe implements PipeTransform {
    public transform(value: ReactiveTool[]): any {
        if (value instanceof Array) {
            value.sort((a, b) => {
                if (a.order === b.order) {
                    return 0;
                }
                return a.order < b.order ? -1 : 1;
            });
        }
        return value;
    }
}
