import {TestBed} from '@angular/core/testing';

import {TimeoutService} from './timeout.service';

describe(TimeoutService.name, () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: TimeoutService = TestBed.get(TimeoutService);
        expect(service).toBeTruthy();
    });
});
