export type SideBarBackground = 'darker' | 'dark' | 'lite' | 'liter' | 'white';

export interface SideBarComponentStyle {
    getBackground(): SideBarBackground;
}

export function isSideBarComponentStyle(value: any): value is SideBarComponentStyle {
    return typeof (<SideBarComponentStyle>value).getBackground === 'function';
}
