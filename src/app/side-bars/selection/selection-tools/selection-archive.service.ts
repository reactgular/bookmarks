import {ElementRef, Injectable, ViewContainerRef} from '@angular/core';
import {faArchive} from '@fortawesome/free-solid-svg-icons';
import {Observable, of} from 'rxjs';
import {ReactiveTool} from '../../../shared/reactive-tools/reactive-tool';

@Injectable()
export class SelectionArchiveService implements ReactiveTool {
    public readonly order: string = '0999:0100';

    public icon(): Observable<any> {
        return of(faArchive);
    }

    public title(): Observable<string> {
        return of('Archive');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
    }
}
