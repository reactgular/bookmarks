import {animate, animateChild, AnimationEvent, group, query, state, style, transition, trigger} from '@angular/animations';
import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Select} from '@ngxs/store';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {first, map, takeUntil} from 'rxjs/operators';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {AniOpenCloseEnum} from '../../animations/animations.typets';
import {LogService} from '../../dev-tools/log/log.service';
import {TimeoutService} from '../../dev-tools/timeout/timeout.service';
import {editorAnimation} from '../editor-animations';
import {EditorDialogTransition, EditorDialogTransitionRect} from '../editor-dialog-transition';

@Component({
    selector: 'tag-editor-scale',
    templateUrl: './editor-scale.component.html',
    styleUrls: ['./editor-scale.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('transition', [
            state('start', style({
                    position: 'absolute',
                    top: '{{top}}px',
                    left: '{{left}}px',
                    width: '{{width}}px',
                    height: '{{height}}px',
                    'border-radius': '{{radius}}px'
                }), {params: {top: 0, left: 0, width: 0, height: 0, radius: 0}}
            ),
            transition('start => end', [
                group([
                    style({
                        position: 'absolute',
                        top: '{{fromTop}}px',
                        left: '{{fromLeft}}px',
                        width: '{{fromWidth}}px',
                        height: '{{fromHeight}}px',
                        'border-radius': '{{fromRadius}}px'
                    }),
                    animate(editorAnimation, style({
                        position: 'absolute',
                        top: '{{toTop}}px',
                        left: '{{toLeft}}px',
                        width: '{{toWidth}}px',
                        height: '{{toHeight}}px',
                        'border-radius': '{{toRadius}}px'
                    })),
                    query('@scale', animateChild()),
                    query('@editorColorBg', animateChild())
                ])
            ])
        ]),
        trigger('scale', [
            transition('start => end', [
                style({transform: 'scaleX({{fromScaleX}}) scaleY({{fromScaleY}})'}),
                animate(editorAnimation, style({transform: 'scaleX({{toScaleX}}) scaleY({{toScaleY}})'}))
            ])
        ])
    ]
})
export class EditorScaleComponent implements OnDestroy {
    @Output()
    public done: EventEmitter<void> = new EventEmitter();

    @Select(CardEditorState.editorState)
    public editorState$: Observable<AniOpenCloseEnum>;

    @Output()
    public start: EventEmitter<void> = new EventEmitter();

    public state$: ReplaySubject<any> = new ReplaySubject(1);

    private readonly _destroyed: Subject<void> = new Subject();

    @Select(CardEditorState.isNewCard)
    private _isNewCard$: Observable<boolean>;

    private readonly _log: LogService;

    public constructor(private _timeOut: TimeoutService,
                       private _elRef: ElementRef<HTMLElement>,
                       log: LogService) {
        this._log = log.withPrefix(EditorScaleComponent.name);
    }

    @Input()
    public set transition(trans: EditorDialogTransition) {
        this._log.debug('transition', trans);
        if (trans && (trans.dir === 'open' || trans.dir === 'close')) {
            this._isNewCard$
                .pipe(first(), takeUntil(this._destroyed))
                .subscribe(isNewCard => {
                    function radius(start: boolean): number {
                        if (!isNewCard) {
                            return 0;
                        }
                        const min = trans.dir === 'open' ? 28 : 0;
                        const max = trans.dir === 'close' ? 28 : 0;
                        return start ? min : max;
                    }

                    const startState = {
                        value: 'start',
                        params: {
                            dir: trans.dir,
                            top: trans.from.top,
                            left: trans.from.left,
                            width: trans.from.width,
                            height: trans.from.height,
                            radius: radius(true)
                        }
                    };
                    this.state$.next(startState);
                    this._timeOut.run()
                        .pipe(takeUntil(this._destroyed))
                        .subscribe(() => {
                            const endState: any = {
                                value: 'end',
                                params: {
                                    dir: trans.dir,
                                    fromTop: trans.from.top,
                                    fromLeft: trans.from.left,
                                    fromWidth: trans.from.width,
                                    fromHeight: trans.from.height,
                                    fromRadius: radius(true),
                                    toTop: trans.to.top,
                                    toLeft: trans.to.left,
                                    toWidth: trans.to.width,
                                    toHeight: trans.to.height,
                                    toRadius: radius(false)
                                }
                            };
                            if (trans.dir === 'open') {
                                endState.params.fromScaleX = trans.from.width / trans.to.width;
                                endState.params.fromScaleY = trans.from.height / trans.to.height;
                                endState.params.toScaleX = 1;
                                endState.params.toScaleY = 1;
                            } else if (trans.dir === 'close') {
                                endState.params.fromScaleX = 1;
                                endState.params.fromScaleY = 1;
                                endState.params.toScaleX = trans.to.width / trans.from.width;
                                endState.params.toScaleY = trans.to.height / trans.from.height;
                            }
                            this.state$.next(endState);
                        });
                });
        } else {
            this.state$.next();
        }
    }

    public animationDone(event: AnimationEvent) {
        if (event.phaseName === 'done'
            && event.fromState === 'start'
            && event.toState === 'end') {
            this._log.debug('animationDone', event);
            this.done.next();
        } else if (event.phaseName === 'start'
            && event.fromState === 'start'
            && event.toState === 'end') {
            this._log.debug('animationDone', event);
            this.start.next();
        }
    }

    public getClientRect(): Observable<EditorDialogTransitionRect> {
        return this._timeOut.run()
            .pipe(
                map(() => {
                    const rect = this._elRef.nativeElement.getBoundingClientRect();
                    return {top: rect.top, left: rect.left, width: rect.width, height: rect.height};
                }),
                takeUntil(this._destroyed)
            );
    }

    public ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }
}
