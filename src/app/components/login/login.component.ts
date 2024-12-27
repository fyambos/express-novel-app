import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: string = '';
  loginSuccess: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    this.authService
      .signIn(this.email, this.password)
      .then(() => {
        this.loginSuccess = 'Login successful!';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      })
      .catch((error) => {
        this.loginError = error.message;
      });
  }
}
