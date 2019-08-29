import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PipesModule} from '../../pipes/pipes.module';
import {UiModule} from '../../ui/ui.module';
import {CardSelectComponent} from '../card-select/card-select.component';
import {CardToolbarComponent} from '../card-toolbar/card-toolbar.component';
import {CardViewComponent} from './card-view.component';

describe(CardViewComponent.name, () => {
    let component: CardViewComponent;
    let fixture: ComponentFixture<CardViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CardViewComponent,
                CardViewComponent,
                CardToolbarComponent,
                CardSelectComponent
            ],
            imports: [
                PipesModule,
                UiModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
