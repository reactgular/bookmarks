export interface EditorDialogTransitionRect {
    height: number;
    left: number;
    top: number;
    width: number;
}

export interface EditorDialogTransition {
    dir: 'open' | 'close';
    from: EditorDialogTransitionRect;
    to: EditorDialogTransitionRect;
}
