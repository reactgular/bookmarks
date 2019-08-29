import {animate, style, transition, trigger} from '@angular/animations';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'tag-message-big-icon',
    templateUrl: './message-big-icon.component.html',
    styleUrls: ['./message-big-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[@state]': 'true'
    },
    animations: [
        trigger('state', [
            transition(':enter', [
                style({opacity: 0}),
                animate('300ms ease-in', style({opacity: 1}))
            ])
        ])
    ]
})
export class MessageBigIconComponent {
    @Input()
    public icon: any;

    @Input()
    public message: string;
}
