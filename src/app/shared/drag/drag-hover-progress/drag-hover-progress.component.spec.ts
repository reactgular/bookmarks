import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DragHoverProgressComponent} from './drag-hover-progress.component';

describe(DragHoverProgressComponent.name, () => {
    let component: DragHoverProgressComponent;
    let fixture: ComponentFixture<DragHoverProgressComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DragHoverProgressComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DragHoverProgressComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
