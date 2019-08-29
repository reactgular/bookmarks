import {ElementRef} from '@angular/core';
import {ElementDirective} from './element.directive';

describe(ElementDirective.name, () => {
    it('should create an instance', () => {
        const directive = new ElementDirective(new ElementRef({}));
        expect(directive).toBeTruthy();
        expect(directive.ref).toBeTruthy();
    });
});
