import {TestBed} from '@angular/core/testing';
import {DragBehaviorService} from './drag-behavior.service';

describe(DragBehaviorService.name, () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DragBehaviorService = TestBed.get(DragBehaviorService);
        expect(service).toBeTruthy();
    });
});
