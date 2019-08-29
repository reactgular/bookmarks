import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CardOutlineComponent} from './card-outline.component';

describe(CardOutlineComponent.name, () => {
    let component: CardOutlineComponent;
    let fixture: ComponentFixture<CardOutlineComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CardOutlineComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardOutlineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
