import {inject, TestBed} from '@angular/core/testing';
import {EditorModalService} from './editor-modal.service';

describe(EditorModalService.name, () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditorModalService]
        });
    });

    it('should be created', inject([EditorModalService], (service: EditorModalService) => {
        expect(service).toBeTruthy();
    }));
});
