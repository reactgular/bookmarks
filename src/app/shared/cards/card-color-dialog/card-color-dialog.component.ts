import {animate, style, transition, trigger} from '@angular/animations';
import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Subject} from 'rxjs';
import {LogService} from '../../dev-tools/log/log.service';
import {COLOR_PICKER_DATA, ColorPickerData} from '../cards-types';

export type CardColorPosition = 'below' | 'above';

@Component({
    selector: 'tag-card-color-dialog',
    templateUrl: './card-color-dialog.component.html',
    styleUrls: ['./card-color-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[@fadeInOut]': '"shown"'
    },
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({opacity: 0}),
                animate('250ms ease-in', style({opacity: 1}))
            ]),
            transition(':leave', [
                style({opacity: 1}),
                animate('250ms ease-in', style({opacity: 0}))
            ])
        ])
    ]
})
export class CardColorDialogComponent {
    public color: number = null;

    public colorChanged: Subject<number> = new Subject();

    private readonly _log: LogService;

    public constructor(@Inject(COLOR_PICKER_DATA) public data: ColorPickerData,
                       log: LogService) {
        this._log = log.withPrefix(CardColorDialogComponent.name);
        this.color = data.color;
    }

    public setColor(color: number) {
        if (this.color !== color) {
            this.color = color;
            this.colorChanged.next(this.color);
        }
    }
}
