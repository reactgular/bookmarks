import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditorDialogComponent} from './editor-dialog.component';

describe(EditorDialogComponent.name, () => {
    let component: EditorDialogComponent;
    let fixture: ComponentFixture<EditorDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditorDialogComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
