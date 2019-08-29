import {AbstractControl} from '@angular/forms';

export class ErrorMessages {
    private _messages: Map<string, any> = new Map();

    public constructor(private readonly _control: AbstractControl,
                       title: string) {
        this.set('required', `${title} is required`);
        this.set('minlength', `${title} is too short`);
        this.set('maxlength', `${title} is too long`);
    }

    public getMessage(): string {
        const keys = Object.keys(this._control.errors || {});
        if (keys.length) {
            const key = keys[0];
            if (this._messages.has(key)) {
                const error = this._control.errors[key];
                const message = this._messages.get(key);
                return typeof message === 'function'
                    ? message(error)
                    : message;
            }
        }
        return 'Input is not valid';
    }

    public hasErrors(): boolean {
        const keys = Object.keys(this._control.errors || {});
        return Boolean(keys.length);
    }

    public set(name: string, message: any): ErrorMessages {
        this._messages.set(name, message);
        return this;
    }
}
