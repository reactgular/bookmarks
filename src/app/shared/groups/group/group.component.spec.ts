import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CardsModule} from '../../cards/cards.module';
import {LayoutsModule} from '../../layouts/layouts.module';

import {GroupComponent} from './group.component';

describe(GroupComponent.name, () => {
    let component: GroupComponent;
    let fixture: ComponentFixture<GroupComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GroupComponent],
            imports: [
                CardsModule,
                LayoutsModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
