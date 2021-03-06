import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TimestampComponent} from './timestamp.component';

describe(TimestampComponent.name, () => {
    let component: TimestampComponent;
    let fixture: ComponentFixture<TimestampComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TimestampComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TimestampComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
