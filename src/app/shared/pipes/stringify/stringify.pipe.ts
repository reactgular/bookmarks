import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'stringify', pure: true})
export class StringifyPipe implements PipeTransform {
    transform(value: any, space?: number): any {
        return JSON.stringify(value, null, space);
    }

}
