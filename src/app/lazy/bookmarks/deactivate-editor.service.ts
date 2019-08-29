import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {Select} from '@ngxs/store';
import {Observable} from 'rxjs';
import {filter, first} from 'rxjs/operators';
import {AniOpenCloseEnum} from '../../shared/animations/animations.typets';
import {CardEditorState} from '../../states/editor/card-editor/card-editor.state';
import {EditorState} from '../../states/editor/editor.state';
import {OutletEditorComponent} from './outlet-editor/outlet-editor.component';

@Injectable({providedIn: 'root'})
export class DeactivateEditor implements CanDeactivate<OutletEditorComponent> {
    @Select(EditorState.canChangeRoute)
    public canChangeRoute$: Observable<boolean>;

    @Select(CardEditorState.editorState)
    public editorState$: Observable<AniOpenCloseEnum>;

    public canDeactivate(component: OutletEditorComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot)
        : Observable<boolean> {

        return this.canChangeRoute$.pipe(
            filter(Boolean),
            first()
        );
    }
}
