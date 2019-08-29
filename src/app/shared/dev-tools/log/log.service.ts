/* tslint:disable:no-console */
import {Inject, Injectable} from '@angular/core';
import {Observable, OperatorFunction} from 'rxjs';
import {tap} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {StackTraceService} from '../stack-trace/stack-trace.service';
import {WINDOW} from '../window-token';

const PREFIX_SEPARATOR = ':';

/**
 * @todo Should make console object injectable.
 */
@Injectable({providedIn: 'root'})
export class LogService {
    /**
     * Output prefix
     */
    private prefixName: string;

    /**
     * Allows for optional prefix.
     */
    public constructor(private stackTrace: StackTraceService,
                       @Inject(WINDOW) private wnd: Window) {
        this.prefixName = '';
    }

    /**
     * Flag if debugging is enabled.
     */
    private _debug: boolean = !environment.production;

    public get debug(): Function {
        if (!this._debug || !console || !console.log) {
            return Function.prototype;
        }
        return this.prefixName
            ? console.log.bind(console, this.prefixName)
            : console.log.bind(console);
    }

    public get error(): Function {
        if (!console || !console.error) {
            return Function.prototype;
        }
        return this.prefixName
            ? console.error.bind(console, this.prefixName)
            : console.error.bind(console);
    }

    public get info(): Function {
        if (!console || !console.info) {
            return Function.prototype;
        }
        return this.prefixName
            ? console.info.bind(console, this.prefixName)
            : console.info.bind(console);
    }

    public get warn(): Function {
        if (!console || !console.warn) {
            return Function.prototype;
        }
        return this.prefixName
            ? console.warn.bind(console, this.prefixName)
            : console.warn.bind(console);
    }

    /**
     * Creates a new logger with the given prefix in all output messages.
     */
    public prefix(prefix?: string): LogService {
        let log: LogService = this;
        if (prefix) {
            log = new LogService(this.stackTrace, this.wnd);
            log.prefixName = (this.prefixName || '') + prefix + PREFIX_SEPARATOR;
        }
        return log;
    }

    /**
     * Creates an observable operator that tags into the stream and logs values.
     */
    public stream<T>(...args): OperatorFunction<T, T> {
        if (!this._debug || !console || !console.log) {
            return (source: Observable<T>): Observable<T> => source;
        }
        return (source: Observable<T>): Observable<T> => {
            return source.pipe(tap(value => {
                const prefix = this.prefixName ? this.prefixName.replace(/:$/, '') + '$' : '$';
                console.log(...[prefix, ...args, value]);
            }));
        };
    }

    /**
     * Creates an observable operator that tags into the stream and logs values.
     */
    public streamError<T>(...args): OperatorFunction<T, T> {
        if (!this._debug || !console || !console.log) {
            return (source: Observable<T>): Observable<T> => source;
        }
        return (source: Observable<T>): Observable<T> => {
            return source.pipe(tap(value => {
                const prefix = this.prefixName ? this.prefixName.replace(/:$/, '') + '$' : '$';
                console.error(...[prefix, ...args, value]);
            }));
        };
    }

    /**
     * Creates a logger with an automatic prefix.
     */
    public withPrefix(prefix: string): LogService {
        if (!this._debug) {
            return this;
        }
        if (prefix) {
            prefix = prefix.replace(/(Component|Directive|Service|Factory|Pipe|Resource|Module|Resolver|Provider)$/, '');
        }
        // Will be "unknown" in all IE browsers.
        return this.prefix(prefix || 'unknown');
    }

    /**
     * Gets the constructor name from the call stack, but only on Chrome browsers.
     */
    private getConstructorName(depth: number): string | undefined {
        if (typeof this.wnd['chrome'] === 'undefined') {
            return void 0;
        }
        const trace = this.stackTrace.trace();
        if (!trace || trace.length <= depth) {
            return void 0;
        }
        const str = trace[depth];
        const match = /\s+at\s(new\s)?([$A-Z_][$A-Z_0-9]+)(\.([$A-Z_][$A-Z_0-9]+))?\s/i.exec(str);
        return match && match[2]
            ? match[2].replace(/(Component|Directive|Service|Factory|Pipe|Resource|Module|Resolver|Provider)$/, '')
            : void 0;
    }
}
