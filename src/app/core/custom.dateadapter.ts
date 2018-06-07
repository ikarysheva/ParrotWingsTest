import { Platform } from '@angular/cdk/platform';
import { NativeDateAdapter } from '@angular/material';

export class CustomDateAdapter extends NativeDateAdapter {

    constructor(matDateLocale: string) {
        super(matDateLocale, new Platform);
    }

}
