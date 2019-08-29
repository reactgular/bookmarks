import {animate, style, transition, trigger} from '@angular/animations';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'tag-card-empty',
    templateUrl: './card-empty.component.html',
    styleUrls: ['./card-empty.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[@fadeInOut]': 'true',
        '[@.disabled]': '!animate'
    },
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({opacity: 0, height: 0}),
                animate('300ms ease-in-out', style({opacity: 1, height: '*'}))
            ]),
            transition(':leave', [
                style({opacity: 1, height: '*'}),
                animate('300ms ease-in-out', style({opacity: 0, height: 0}))
            ])
        ])
    ]
})
export class CardEmptyComponent {
    @Input()
    public animate: boolean = true;
}
