import {TestBed} from '@angular/core/testing';

import {DragEventsService} from './drag-events.service';

describe(DragEventsService.name, () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DragEventsService = TestBed.get(DragEventsService);
        expect(service).toBeTruthy();
    });
});
