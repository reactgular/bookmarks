import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'tag-outlet-feedback',
    templateUrl: './outlet-feedback.component.html',
    styleUrls: ['./outlet-feedback.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletFeedbackComponent {
}
