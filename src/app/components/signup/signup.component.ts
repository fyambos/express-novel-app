import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  signupError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
  ) {}

  async signup() {
    try {
      const user = await this.authService.signUp(this.email, this.password);
      if (user) {
        this.router.navigate(['/']);
      } else {
        throw new Error('User is null');
      }
    } catch (error) {
      console.log('Error signing up:', error);
      this.signupError = (error as any).message;
    }
  }
}
