import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditorScaleComponent} from './editor-scale.component';

describe(EditorScaleComponent.name, () => {
    let component: EditorScaleComponent;
    let fixture: ComponentFixture<EditorScaleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditorScaleComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorScaleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
