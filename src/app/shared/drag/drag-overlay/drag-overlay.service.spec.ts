import {TestBed} from '@angular/core/testing';

import {DragOverlayService} from './drag-overlay.service';

describe(DragOverlayService.name, () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DragOverlayService = TestBed.get(DragOverlayService);
        expect(service).toBeTruthy();
    });
});
