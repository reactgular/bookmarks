import {ChangeDetectionStrategy, Component} from '@angular/core';
import {faTags} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'tag-outlet-label',
    templateUrl: './outlet-label.component.html',
    styleUrls: ['./outlet-label.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletLabelComponent {
    public icon = faTags;
}
