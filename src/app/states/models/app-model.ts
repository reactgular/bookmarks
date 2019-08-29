export interface AppHtmlMeta {
    /**
     * Page description
     */
    description?: string;
    /**
     * Page title
     */
    title: string;
}

export interface AppModel {
    meta: AppHtmlMeta;
    networkRead: boolean;
    networkWrite: boolean;
    search: boolean;
}
