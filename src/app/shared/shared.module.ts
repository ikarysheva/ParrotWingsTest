import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { PasswordValidator } from './password.validator';

const ANGULAR_MODULES: any[] = [
  FormsModule, ReactiveFormsModule
];

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    MaterialModule,
    CommonModule,
    ANGULAR_MODULES,
    FlexLayoutModule
  ],
  declarations: []
})
export class SharedModule { }
