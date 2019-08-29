import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CardCreateButtonComponent} from './card-create-button.component';

describe(CardCreateButtonComponent.name, () => {
    let component: CardCreateButtonComponent;
    let fixture: ComponentFixture<CardCreateButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CardCreateButtonComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardCreateButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
