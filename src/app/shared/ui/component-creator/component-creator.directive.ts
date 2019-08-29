import {ComponentFactoryResolver, Directive, Injector, Type, ViewContainerRef} from '@angular/core';
import {LogService} from '../../dev-tools/log/log.service';
import {SideBarComponentStyle} from '../../side-bars/side-bars.types';

@Directive({
    selector: '[tagComponentCreator]'
})
export class ComponentCreatorDirective {
    private readonly _log: LogService;

    public constructor(private _view: ViewContainerRef,
                       private _resolver: ComponentFactoryResolver,
                       private _injector: Injector,
                       log: LogService) {
        this._log = log.withPrefix(ComponentCreatorDirective.name);
    }

    public create<TComponent>(component: Type<TComponent>): TComponent {
        const factory = this._resolver.resolveComponentFactory(component);
        const ref = this._view.createComponent<TComponent>(factory, undefined, this._injector);
        return ref.instance;
    }
}
