import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DragCardComponent} from './drag-card.component';

describe(DragCardComponent.name, () => {
    let component: DragCardComponent;
    let fixture: ComponentFixture<DragCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DragCardComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DragCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
