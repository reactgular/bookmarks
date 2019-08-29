import {OverlayRef} from '@angular/cdk/overlay';
import {ElementRef} from '@angular/core';

export class MaterialHacker {
    public static accessBackdrop(overlayRef: OverlayRef): ElementRef<HTMLDivElement> | null {
        if (overlayRef['_backdropElement']) {
            return new ElementRef(overlayRef['_backdropElement']);
        }
        return null;
    }

    public static transparentBackdrop(overlayRef: OverlayRef) {
        const backdrop = MaterialHacker.accessBackdrop(overlayRef);
        if (!backdrop) {
            throw new Error('Overlay has no backdrop. Did you forget to attach?');
        }
        backdrop.nativeElement.classList.add('tag-backdrop-transparent');
    }
}
