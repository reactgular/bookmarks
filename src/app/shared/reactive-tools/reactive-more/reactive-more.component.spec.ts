import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReactiveMoreComponent} from './reactive-more.component';

describe(ReactiveMoreComponent.name, () => {
    let component: ReactiveMoreComponent;
    let fixture: ComponentFixture<ReactiveMoreComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReactiveMoreComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReactiveMoreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
