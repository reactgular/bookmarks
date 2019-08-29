import {ElementRef, Injectable, ViewContainerRef} from '@angular/core';
import {faTag} from '@fortawesome/free-solid-svg-icons';
import {Observable, of} from 'rxjs';
import {ReactiveTool} from '../../../shared/reactive-tools/reactive-tool';

@Injectable()
export class SelectionLabelsService implements ReactiveTool {
    public readonly order: string = '0300:0100';

    public icon(): Observable<any> {
        return of(faTag);
    }

    public title(): Observable<string> {
        return of('Add label');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
    }
}
