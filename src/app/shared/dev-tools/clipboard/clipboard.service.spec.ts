import {inject, TestBed} from '@angular/core/testing';
import {ClipboardService} from './clipboard.service';

describe(ClipboardService.name, () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ClipboardService]
        });
    });

    it('should be created', inject([ClipboardService], (service: ClipboardService) => {
        expect(service).toBeTruthy();
    }));
});
