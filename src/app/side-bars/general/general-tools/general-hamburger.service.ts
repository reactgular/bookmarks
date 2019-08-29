import {Inject, Injectable} from '@angular/core';
import {faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faBars} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngxs/store';
import {combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {EditorModalInterface} from '../../../shared/editor/editor-modal-interface';
import {EDITOR_MODAL_TOKEN} from '../../../shared/editor/editor-modal-token';
import {HotKeyDescription} from '../../../shared/hot-keys/hot-keys.types';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolDisabled, ReactiveToolHotKey} from '../../../shared/reactive-tools/reactive-tool';
import {LayoutState} from '../../../states/layout/layout.state';
import {SideBarsToggleAction} from '../../../states/side-bars/side-bars-toggle.action';
import {SideBarsState} from '../../../states/side-bars/side-bars.state';

@Injectable()
export class GeneralHamburgerService implements ReactiveTool, ReactiveToolDisabled, ReactiveToolHotKey {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: 'main:hamburger'
    };

    public readonly hotKey: HotKeyDescription = {code: 'CTRL+M', message: 'Opens and closes the side menu'};

    private readonly _toggleMode$: Observable<boolean>;

    public constructor(private _store: Store,
                       @Inject(EDITOR_MODAL_TOKEN) private _editorModal: EditorModalInterface) {
        this._toggleMode$ = combineLatest([
            this._store.select(LayoutState.isWeb),
            this._store.select(SideBarsState.isOpen)
        ]).pipe(
            map(([isWeb, sideBar]) => isWeb || !sideBar),
            distinctUntilChanged()
        );
    }

    public disabled(): Observable<boolean> {
        return this._store.select(SideBarsState.isAnimating);
    }

    public icon(): Observable<any> {
        return this._store.select(SideBarsState.state).pipe(
            map(value => {
                if (value === 'open') {
                    return faAngleLeft;
                } else if (value === 'closing') {
                    return faAngleDoubleLeft;
                } else if (value === 'close') {
                    return faBars;
                }
                return faAngleDoubleRight;
            })
        );
    }

    public title(): Observable<string> {
        return this._store.select(SideBarsState.isOpen).pipe(
            map(value => value ? 'Hide Menu' : 'Show Menu')
        );
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
        this._editorModal.close().subscribe(() => this._store.dispatch(new SideBarsToggleAction()));
    }
}
