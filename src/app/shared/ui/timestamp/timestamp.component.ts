import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {EntityTimestamp} from '../../networks/networks.types';

@Component({
    selector: 'tag-timestamp',
    templateUrl: './timestamp.component.html',
    styleUrls: ['./timestamp.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimestampComponent {
    @Input()
    public entity: EntityTimestamp;
}
