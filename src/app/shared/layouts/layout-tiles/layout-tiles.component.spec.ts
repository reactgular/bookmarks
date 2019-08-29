import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LayoutTilesComponent} from './layout-tiles.component';

xdescribe(LayoutTilesComponent.name, () => {
    let component: LayoutTilesComponent;
    let fixture: ComponentFixture<LayoutTilesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LayoutTilesComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LayoutTilesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
