import { FormControl, FormGroup, NgForm, FormGroupDirective } from '@angular/forms';

export class PasswordValidator {

    static matchingPasswords(formGroup: FormGroup, confirmKey: string) {
        let value;
        let valid = true;
        for (const key in formGroup.controls) {
            if (formGroup.controls.hasOwnProperty(key)) {
                const control: FormControl = <FormControl>formGroup.controls[key];

                if (value === undefined) {
                    value = control.value;
                } else {
                    if (value !== control.value) {
                        valid = false;
                        break;
                    }
                }
            }
        }

        if (valid) {
            return null;
        } else {
            formGroup.controls[confirmKey].setErrors({ passwordMismatch: true });
        }

        return {
            passwordMismatch: true
        };
    }
}
