import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardEmptyComponent} from './card-empty.component';

describe(CardEmptyComponent.name, () => {
    let component: CardEmptyComponent;
    let fixture: ComponentFixture<CardEmptyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CardEmptyComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardEmptyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
