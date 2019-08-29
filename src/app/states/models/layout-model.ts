export type LayoutDevice = 'handset' | 'tablet' | 'web';

export type LayoutOrientation = 'portrait' | 'landscape';

export interface LayoutModel {
    device: LayoutDevice;
    orientation: LayoutOrientation;
}
