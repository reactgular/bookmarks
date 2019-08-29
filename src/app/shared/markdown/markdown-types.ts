export interface TocEntry {
    pageId: string;
    route: string;
    title: string;
}

export interface MarkdownPage {
    markdown: string;
    pageId: string;
}

export interface BookModule {
    page: MarkdownPage;
    toc: TocEntry[];
}
