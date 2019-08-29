import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupDropItemTargetComponent} from './group-drop-item-target.component';

describe(GroupDropItemTargetComponent.name, () => {
    let component: GroupDropItemTargetComponent;
    let fixture: ComponentFixture<GroupDropItemTargetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GroupDropItemTargetComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupDropItemTargetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
