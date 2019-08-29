import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {LogService} from '../../dev-tools/log/log.service';
import {MetaEntity} from '../../networks/entities/meta.entity';
import {ApiResponse} from '../api.types';
import {RestService} from '../rest/rest.service';

@Injectable({providedIn: 'root'})
export class MetaService {

    private readonly _log: LogService;

    public constructor(private _rest: RestService,
                       log: LogService) {
        this._log = log.withPrefix(MetaService.name);
    }

    public fetch(url: string): Observable<ApiResponse<MetaEntity>> {
        return this._rest.post<MetaEntity>(`meta`, {url});
    }
}
