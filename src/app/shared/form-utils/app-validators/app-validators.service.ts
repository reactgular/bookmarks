import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Objects} from '../../../utils/objects';
import {LogService} from '../../dev-tools/log/log.service';
import {FormUtilsModule} from '../form-utils.module';

@Injectable({
    providedIn: FormUtilsModule
})
export class AppValidatorsService {

    private readonly _log: LogService;

    public constructor(log: LogService) {
        this._log = log.withPrefix(AppValidatorsService.name);
    }

    private static errors(name: string): ValidationErrors {
        return Objects.set({}, name, true);
    }

    public mustEqual(other: AbstractControl, name: string = 'mustEqual'): ValidatorFn {
        return (c: AbstractControl): ValidationErrors | null => {
            return other.value !== c.value ? AppValidatorsService.errors(name) : null;
        };
    }

    public mustNotEqual(other: AbstractControl, name: string = 'mustNotEqual'): ValidatorFn {
        return (c: AbstractControl): ValidationErrors | null => {
            return other.value === c.value ? AppValidatorsService.errors(name) : null;
        };
    }

    public otherHasValue(other: AbstractControl, name: string = 'otherHasValue'): ValidatorFn {
        return (c: AbstractControl): ValidationErrors | null => {
            return !other.value ? AppValidatorsService.errors(name) : null;
        };
    }
}
