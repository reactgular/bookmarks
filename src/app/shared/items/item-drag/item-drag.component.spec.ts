import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemDragComponent} from './item-drag.component';

describe(ItemDragComponent.name, () => {
    let component: ItemDragComponent;
    let fixture: ComponentFixture<ItemDragComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ItemDragComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ItemDragComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
