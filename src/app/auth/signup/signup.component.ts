import { Component, OnInit } from '@angular/core';
import { AuthRoutingModule } from '../auth-routing.module';
import { AuthService } from '../../core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';
import { PasswordValidator } from '../../shared/password.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  registrationForm: FormGroup;
  returnUrl = '/';
  error = '';
  hide = true;

  constructor(public fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      passwords: this.fb.group({
        password: ['', [Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      }, { validator: (formGroup: FormGroup) => PasswordValidator.matchingPasswords(formGroup, 'confirmPassword') })

    });
    this.authService.logout();
  }

  get name() {
    return this.registrationForm.get('name');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get password() {
    return this.passwords.get('password');
  }

  get confirmPassword() {
    return this.passwords.get('confirmPassword');
  }

  get passwords() {
    return this.registrationForm.get('passwords');
  }

  onRegistration() {
    if (!this.registrationForm.valid) {
      return;
    }
    return this.authService.registration(this.name.value, this.email.value, this.password.value)
      // .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        err => {
          this.error = err.error;
          // this.loading = false;
        });
  }

}
