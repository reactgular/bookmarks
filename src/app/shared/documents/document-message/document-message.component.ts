import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'tag-document-message',
    templateUrl: './document-message.component.html',
    styleUrls: ['./document-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentMessageComponent {
}
