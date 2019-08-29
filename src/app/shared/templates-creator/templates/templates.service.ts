import {TitleCasePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Select} from '@ngxs/store';
import {combineLatest, Observable, of} from 'rxjs';
import {first, map, shareReplay} from 'rxjs/operators';
import {EditorNextIds} from '../../../states/editor/editor-next-ids';
import {StorageState} from '../../../states/storage/storage.state';
import {DocumentResponse} from '../../networks/entities/document.entity';
import {TemplateEntity, TemplateEntry} from '../../networks/entities/template.entity';
import {DocumentGenerator} from '../document-generator/document-generator';

@Injectable()
export class TemplatesService {
    private static BASE_URL = '/assets/templates';

    private static readonly REMAP_TITLE = {
        'ad-related': 'Advertising',
        'ai': 'Artificial Intelligence',
        'seo': 'SEO',
        'vr': 'Virtual Reality',
        'tech': 'Technology',
        'iot': 'Internet of Things',
        'private-equity': 'Private Equity',
        'content-marketing': 'Content Marketing',
        'data-science': 'Data Science'
    };

    @Select(StorageState.nextIds)
    public nextIds$: Observable<EditorNextIds>;

    public readonly templates$: Observable<TemplateEntity[]>;

    public constructor(private _httpClient: HttpClient,
                       private _titleCase: TitleCasePipe) {
        this.templates$ = this._httpClient.get<string[]>(`${TemplatesService.BASE_URL}/templates.json`).pipe(
            map<string[], TemplateEntity[]>(titles => titles.map(id => {
                return {id, title: this.toTitle(id)};
            })),
            shareReplay()
        );
    }

    public create(template_id?: string): Observable<DocumentResponse> {
        const templateEntries = template_id ? this.getTemplateEntries(template_id) : of([]);
        return combineLatest([
            this.nextIds$,
            templateEntries
        ]).pipe(
            map(([nextIds, entries]) => {
                return new DocumentGenerator(nextIds, entries, this.toTitle(template_id)).createDocument();
            }),
            first()
        );
    }

    public getTemplateEntries(template_id: string): Observable<TemplateEntry[]> {
        return this._httpClient.get<TemplateEntry[]>(`${TemplatesService.BASE_URL}/${template_id}.json`);
    }

    private toTitle(template_id: string): string {
        return this._titleCase.transform(TemplatesService.REMAP_TITLE[template_id] || template_id);
    }
}
