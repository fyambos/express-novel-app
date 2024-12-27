import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  isDarkMode = false;
  dropdownOpen = false;
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private auth: Auth,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      this.user = user;
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  handleLogout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Logout failed', error);
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
