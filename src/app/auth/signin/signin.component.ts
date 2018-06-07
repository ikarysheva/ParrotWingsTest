import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  error = '';
  loginForm: FormGroup;
  hide = true;
  returnUrl = '/';

  constructor(public fb: FormBuilder,
    public authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(6)]]
    });
    this.authService.logout();
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    return this.authService.login(this.email.value, this.password.value)
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
