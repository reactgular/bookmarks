import {OverlayConfig} from '@angular/cdk/overlay';
import {Injector, ViewContainerRef} from '@angular/core';

export interface DialogOptions {
    data: any;
    injector: Injector;
    viewContainerRef: ViewContainerRef;
    overlayConfig: OverlayConfig;
}
