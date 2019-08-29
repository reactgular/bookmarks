import {TestBed} from '@angular/core/testing';

import {BreakpointsService} from './breakpoints.service';

describe(BreakpointsService.name, () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: BreakpointsService = TestBed.get(BreakpointsService);
        expect(service).toBeTruthy();
    });
});
