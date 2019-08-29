import {inject, TestBed} from '@angular/core/testing';
import {CardColorModalService} from './card-color-modal.service';

describe(CardColorModalService.name, () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CardColorModalService]
        });
    });

    it('should be created', inject([CardColorModalService], (service: CardColorModalService) => {
        expect(service).toBeTruthy();
    }));
});
