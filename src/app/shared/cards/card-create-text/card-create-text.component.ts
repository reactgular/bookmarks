import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {faEdit} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'tag-card-create-text',
    templateUrl: './card-create-text.component.html',
    styleUrls: ['./card-create-text.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.disabled]': 'disabled'
    }
})
export class CardCreateTextComponent {
    public readonly buttonIcon = faEdit;

    public readonly buttonText = 'Add Bookmarks';

    @Input()
    public disabled: boolean = false;
}
