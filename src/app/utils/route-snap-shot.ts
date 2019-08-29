import {Type} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';

export class RouteSnapshot {
    public static getChildComponent(route: ActivatedRouteSnapshot, component: Type<any>): ActivatedRouteSnapshot {
        if (route.component === component) {
            return route;
        }
        return route.firstChild
            ? RouteSnapshot.getParentComponent(route.firstChild, component)
            : undefined;
    }

    public static getDataOrFail<TType>(route: ActivatedRouteSnapshot, name: string): TType {
        if (route.data.hasOwnProperty(name)) {
            return route.data[name];
        }
        if (route.parent) {
            return RouteSnapshot.getDataOrFail(route.parent, name);
        }
        throw new Error('Route data is missing: ' + name);
    }

    public static getNumberOrFail(route: ActivatedRouteSnapshot, name: string): number {
        return parseInt(RouteSnapshot.getParamOrFail(route, name), 10);
    }

    public static getParam(route: ActivatedRouteSnapshot, name: string): string {
        if (route.params.hasOwnProperty(name)) {
            return route.params[name];
        }
        if (route.parent) {
            return this.getParam(route.parent, name);
        }
        return void (0);
    }

    public static getParamOrFail(route: ActivatedRouteSnapshot, name: string): string {
        const param = RouteSnapshot.getParam(route, name);
        if (typeof param === 'undefined') {
            throw new Error('Route is missing parameter: ' + name);
        }
        return param;
    }

    public static getParentComponent(route: ActivatedRouteSnapshot, component: Type<any>): ActivatedRouteSnapshot {
        if (route.component === component) {
            return route;
        }
        return route.parent
            ? RouteSnapshot.getParentComponent(route.parent, component)
            : undefined;
    }
}
