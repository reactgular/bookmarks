import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditorColorBgComponent} from './editor-color-bg.component';

describe(EditorColorBgComponent.name, () => {
    let component: EditorColorBgComponent;
    let fixture: ComponentFixture<EditorColorBgComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditorColorBgComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorColorBgComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
