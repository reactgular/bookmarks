export interface DialogConfirmAction {
    color: string;
    title: string;
}

export interface DialogConfirmOptions {
    cancel: Partial<DialogConfirmAction>;
    icon: any;
    message: string;
    okay: Partial<DialogConfirmAction>;
    title: string;
}
