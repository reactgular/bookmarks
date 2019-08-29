import {ComponentType, Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {Injectable, Injector, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {LogService} from '../../dev-tools/log/log.service';
import {DialogConfirmOptions} from '../dialog-confirm-options';
import {DialogConfirmComponent} from '../dialog-confirm/dialog-confirm.component';
import {DIALOG_DATA_TOKEN} from '../dialog-data.token';
import {DialogOptions} from '../dialog-options';
import {DialogRef} from '../dialog-ref';
import {DIALOG_REF_TOKEN} from '../dialog-ref.token';
import {ModalDialogComponent} from '../modal-dialog/modal-dialog.component';

@Injectable({providedIn: 'root'})
export class DialogsService implements OnDestroy {
    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _overlay: Overlay,
                       private _injector: Injector,
                       log: LogService) {
        this._log = log.withPrefix(DialogsService.name);
    }

    public confirm(data: Partial<DialogConfirmOptions>): Observable<boolean> {
        return this.open<DialogConfirmComponent, boolean>(DialogConfirmComponent, {data}).closed;
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public open<TComponent, TData>(
        component: ComponentType<TComponent>,
        options: Partial<DialogOptions> = {}
    ): DialogRef<TComponent, TData> {
        const overlayRef = this._createOverlay(options.overlayConfig || {});
        const dialogRef = new DialogRef<TComponent, TData>(overlayRef, component, this._log);
        const injectionTokens = new WeakMap<any, any>([
            [DIALOG_DATA_TOKEN, options.data],
            [DIALOG_REF_TOKEN, dialogRef]
        ]);
        const injector = new PortalInjector(options.injector || this._injector, injectionTokens);
        overlayRef.attach(new ComponentPortal(ModalDialogComponent, options.viewContainerRef || null, injector));
        return dialogRef;
    }

    private _createOverlay(config: OverlayConfig): OverlayRef {
        this._log.debug('_createOverlay');

        const positionStrategy = this._overlay
            .position()
            .global()
            .centerHorizontally()
            .centerVertically();

        const defaults = {
            positionStrategy,
            hasBackdrop: true
        };

        return this._overlay.create(Object.assign(defaults, config));
    }
}
