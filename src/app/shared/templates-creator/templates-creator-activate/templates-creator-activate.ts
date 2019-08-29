import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngxs/store';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, mapTo, switchMap} from 'rxjs/operators';
import {DocumentsAddAction} from '../../../states/storage/documents/documents-add.action';
import {LogService} from '../../dev-tools/log/log.service';
import {TemplatesService} from '../templates/templates.service';

@Injectable()
export class TemplatesCreatorActivate implements CanActivate {
    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _templates: TemplatesService,
                       log: LogService) {
        this._log = log.withPrefix(TemplatesCreatorActivate.name);
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const mapToTemplate = (id: string) => this._templates.create(id).pipe(
            switchMap(doc => this._store.dispatch(new DocumentsAddAction(doc)))
        );
        const templates$ = ['programming', 'tech'].map(mapToTemplate);
        return forkJoin(templates$).pipe(
            catchError(() => of(true)),
            mapTo(true)
        );
    }
}
