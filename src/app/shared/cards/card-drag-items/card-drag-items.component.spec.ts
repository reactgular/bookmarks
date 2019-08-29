import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardDragItemsComponent} from './card-drag-items.component';

describe(CardDragItemsComponent.name, () => {
    let component: CardDragItemsComponent;
    let fixture: ComponentFixture<CardDragItemsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CardDragItemsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardDragItemsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
