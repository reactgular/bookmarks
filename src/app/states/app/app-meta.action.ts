import {AppHtmlMeta} from '../models/app-model';

export class AppMetaAction {
    public static readonly type: string = '[App] meta';

    public constructor(public readonly meta: AppHtmlMeta) {

    }
}
