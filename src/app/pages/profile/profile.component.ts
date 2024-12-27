import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  async fetchUserProfile() {
    try {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        this.user = await this.userService.fetchUser(currentUser.uid);
        this.isLoading = false;
      } else {
        this.router.navigate(['/login']);
      }
    } catch (error) {
      this.errorMessage = 'Error fetching user profile. Please try again later.';
      this.isLoading = false;
      console.error(error);
    }
  }
}
