import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {LoadingBarComponent} from './loading-bar';

// @ts-ignore
@Component({
    template: `
        <tag-loading-bar [position]="position" [active]="active"></tag-loading-bar>`
})
export class TestLoadingBarComponent {
    @Input()
    public active: boolean = false;

    @Input()
    public position: string = 'top';
}

describe(LoadingBarComponent.name, () => {
    let fixture: ComponentFixture<TestLoadingBarComponent>;
    let comp: TestLoadingBarComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            declarations: [TestLoadingBarComponent, LoadingBarComponent],
        });

        fixture = TestBed.createComponent(TestLoadingBarComponent);
        fixture.detectChanges();
        comp = fixture.componentInstance;
    });

    it('should set top', () => {
        comp.position = 'top';
        fixture.detectChanges();
        const q = fixture.debugElement.query(By.directive(LoadingBarComponent));
        expect(q).not.toBeNull();
        const css = (<HTMLElement>q.nativeElement).className.split(' ');
        expect(css.some((str) => str === 'top')).toBe(true);
    });

    it('should animate the bar when active', () => {
        comp.active = true;
        fixture.detectChanges();
        const q = fixture.debugElement.query(By.directive(LoadingBarComponent));
        expect(q).not.toBeNull();
        const css = (<HTMLElement>q.nativeElement).className.split(' ');
        expect(css.some((str) => str === 'active')).toBe(true);
    });
});
