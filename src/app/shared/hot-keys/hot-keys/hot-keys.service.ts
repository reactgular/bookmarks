import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, OnDestroy} from '@angular/core';
import {fromEvent, Observable, of, Subject} from 'rxjs';
import {filter, first, map, startWith, switchMap, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {parseHotKey} from '../../dev-tools/hot-keys/hot-keys';
import {KeyboardService} from '../../dev-tools/keyboard/keyboard.service';
import {LogService} from '../../dev-tools/log/log.service';
import {
    isReactiveToolDisabled,
    isReactiveToolHotKey,
    reactiveConfig,
    ReactiveTool,
    ReactiveToolHotKey
} from '../../reactive-tools/reactive-tool';
import {ReactiveToolKeyboard} from '../../reactive-tools/reactive-tool-context';
import {HotKeySubscription} from '../hot-keys.types';

@Injectable({providedIn: 'root'})
export class HotKeysService implements OnDestroy {

    private readonly _destroyed$: Subject<void> = new Subject();

    private _disabledCount: number = 0;

    private readonly _log: LogService;

    private _tools: HotKeySubscription[] = [];

    public constructor(@Inject(DOCUMENT) private _doc: Document,
                       private _keyboard: KeyboardService,
                       log: LogService) {
        this._log = log.withPrefix(HotKeysService.name);
    }

    public get esc$(): Observable<void> {
        return this._keyboard.esc$.pipe(
            filter(() => this._disabledCount === 0),
            takeUntil(this._destroyed$)
        );
    }

    public disabledUntil(until: Observable<void>) {
        this._disabledCount++;
        until.pipe(
            first(),
            takeUntil(this._destroyed$)
        ).subscribe(() => this._disabledCount--);
    }

    public getTools(): ReactiveToolHotKey[] {
        return this._tools.map(sub => sub.tool);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public register(tool: ReactiveTool & ReactiveToolHotKey) {
        this._log.debug(`register: ${tool.hotKey.code}`, tool);
        if (this._tools.some(sub => sub.tool === tool)) {
            throw new Error('ReactiveTool key binding already in use');
        }
        const config = reactiveConfig(tool);
        const subscription = this._hotKey(tool).pipe(
            filter(context => (context.when === 'down' && config.down) || (context.when === 'up' && config.up))
        ).subscribe(context => tool.trigger(context));
        this._tools.push({tool, subscription});
    }

    public registerMany(tools: ReactiveTool[]) {
        tools.filter(tool => isReactiveToolHotKey(tool))
            .forEach(tool => this.register(<ReactiveTool & ReactiveToolHotKey>tool));
    }

    public unregister(tool: ReactiveTool & ReactiveToolHotKey) {
        this._log.debug(`unregister: ${tool.hotKey.code}`, tool);
        const sub = this._tools.find(s => s.tool === tool);
        if (!sub) {
            throw new Error('ReactiveTool key binding not registered');
        }
        sub.subscription.unsubscribe();
        this._tools = this._tools.filter(s => s !== sub);
    }

    private _hotKey(tool: ReactiveTool & ReactiveToolHotKey): Observable<ReactiveToolKeyboard> {
        const disabled$ = isReactiveToolDisabled(tool) ? tool.disabled() : of(false);
        const hotKey = parseHotKey(tool.hotKey.code);
        return fromEvent<KeyboardEvent>(this._doc, 'keydown').pipe(
            filter(event => Boolean(event.key)
                && event.type === 'keydown'
                // @note This is a temporary fix until the @reactgular/reactions project is finished and used in this project.
                && (hotKey.key === 'delete'
                    ? (event.key === 'Delete' || event.key === 'Backspace')
                    : (event.key.toLowerCase() === hotKey.key))
                && event.ctrlKey === hotKey.ctrlKey
                && event.altKey === hotKey.altKey
                && event.shiftKey === hotKey.shiftKey
                && !event.repeat),
            withLatestFrom(disabled$),
            filter(([event, disabled]) => !disabled && this._disabledCount === 0),
            switchMap(([event, disabled]) => {
                return fromEvent<KeyboardEvent>(this._doc, 'keyup').pipe(
                    filter(e => e.type === 'keyup'),
                    first(),
                    startWith(event)
                );
            }),
            tap(event => event.preventDefault()),
            map(event => ({type: 'key', when: event.type === 'keydown' ? 'down' : 'up', event} as ReactiveToolKeyboard)),
            this._log.stream(tool.hotKey.code),
            takeUntil(this._destroyed$)
        );
    }
}
