import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {faExclamationTriangle, faSpinner} from '@fortawesome/free-solid-svg-icons';
import {FeatureLoaderState} from '../feature-loader-types';

@Component({
    selector: 'tag-feature-loader',
    templateUrl: './feature-loader.component.html',
    styleUrls: ['./feature-loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureLoaderComponent {
    public iconExclamation = faExclamationTriangle;

    public iconSpinner = faSpinner;

    @Output()
    public retry: EventEmitter<void> = new EventEmitter();

    @Input()
    public state: FeatureLoaderState;
}
