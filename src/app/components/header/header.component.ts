import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  isDarkMode = false;
  dropdownOpen = false;
  user = { email: 'user@example.com' }; // Replace with actual user data

  constructor(private router: Router) {}

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  handleLogout() {
    console.log('Logout triggered');
    // Add logout logic here
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
