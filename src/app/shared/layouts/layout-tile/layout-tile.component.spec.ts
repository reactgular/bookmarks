import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LayoutTilesComponent} from '../layout-tiles/layout-tiles.component';

import {LayoutTileComponent} from './layout-tile.component';

xdescribe(LayoutTileComponent.name, () => {
    let component: LayoutTileComponent;
    let fixture: ComponentFixture<LayoutTileComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LayoutTileComponent
            ],
            providers: [
                {provide: LayoutTilesComponent, useValue: null}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LayoutTileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
