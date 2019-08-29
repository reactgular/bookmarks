import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'untitled', pure: true})
export class UntitledPipe implements PipeTransform {
    public transform(value: string, append?: string): any {
        const trimmed = typeof value === 'string' ? value.trim() : '';
        return trimmed || `Untitled ${append || 'document'}`;
    }
}
