import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemImageComponent} from './item-image.component';

describe(ItemImageComponent.name, () => {
    let component: ItemImageComponent;
    let fixture: ComponentFixture<ItemImageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ItemImageComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ItemImageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
