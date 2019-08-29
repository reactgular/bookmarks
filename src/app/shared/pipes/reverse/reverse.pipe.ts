import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'reverse', pure: true})
export class ReversePipe implements PipeTransform {
    public transform(value: any): any {
        if (value instanceof Array) {
            return [...value].reverse();
        }
        return value;
    }
}
