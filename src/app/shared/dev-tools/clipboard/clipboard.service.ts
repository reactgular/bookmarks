import {DOCUMENT} from '@angular/common';
import {Inject, Injectable} from '@angular/core';
import {LogService} from '../log/log.service';
import {WINDOW} from '../window-token';

@Injectable({
    providedIn: 'root'
})
export class ClipboardService {
    private readonly log: LogService;

    public constructor(@Inject(DOCUMENT) private doc: Document,
                       @Inject(WINDOW) private wnd: Window,
                       log: LogService) {
        this.log = log.withPrefix(ClipboardService.name);
    }

    public copy(text: string): boolean {
        this.log.debug('copy', text);
        if (this.wnd['clipboardData'] && this.wnd['clipboardData'].setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return Boolean(this.wnd['clipboardData'].setData('Text', text));
        } else if (this.doc.queryCommandSupported && this.doc.queryCommandSupported('copy')) {
            const textarea = this.doc.createElement('textarea');
            textarea.textContent = text;
            textarea.style.position = 'fixed';  // Prevent scrolling to bottom of page in MS Edge.
            this.doc.body.appendChild(textarea);
            textarea.select();
            try {
                // Security exception may be thrown by some browsers.
                return this.doc.execCommand('copy');
            } catch (ex) {
                this.log.warn('Copy to clipboard failed.', ex);
                return false;
            } finally {
                this.doc.body.removeChild(textarea);
            }
        }
    }
}
