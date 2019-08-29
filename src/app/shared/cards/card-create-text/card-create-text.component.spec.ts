import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CardCreateTextComponent} from './card-create-text.component';

describe(CardCreateTextComponent.name, () => {
    let component: CardCreateTextComponent;
    let fixture: ComponentFixture<CardCreateTextComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CardCreateTextComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardCreateTextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
