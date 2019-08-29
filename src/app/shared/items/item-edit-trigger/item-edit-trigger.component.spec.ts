import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemEditTriggerComponent} from './item-edit-trigger.component';

describe(ItemEditTriggerComponent.name, () => {
    let component: ItemEditTriggerComponent;
    let fixture: ComponentFixture<ItemEditTriggerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ItemEditTriggerComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ItemEditTriggerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
