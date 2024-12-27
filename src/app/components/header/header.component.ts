import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StoryDialogComponent } from '../story-dialog/story-dialog.component';
import { UserService } from '../../services/user.service';

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
    private dialog: MatDialog,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      this.user = user;
      if (user) {
        this.loadUserTheme(user.uid);
      }
    });
  }

  loadUserTheme(userId: string) {
    this.userService.fetchUser(userId).then(userData => {
      this.isDarkMode = userData.theme === 'dark';
      document.body.classList.toggle('dark', this.isDarkMode);
    }).catch(error => {
      console.error('Error loading user theme:', error);
    });
  }

  saveUserTheme(userId: string, theme: string) {
    this.userService.saveUserTheme(userId, theme).then(() => {
      console.log('User theme updated to:', theme);
    }).catch(error => {
      console.error('Error saving user theme:', error);
    });
  }

toggleDarkMode() {
  this.isDarkMode = !this.isDarkMode;
  document.body.classList.toggle('dark', this.isDarkMode);
  if (this.user) {
    this.saveUserTheme(this.user.uid, this.isDarkMode ? 'dark' : 'light');
  }
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

  openCreateModal() {
    const dialogRef = this.dialog.open(StoryDialogComponent, {
      width: '100vw',
      height: '100vh',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Story Created:', result);
      }
    });
  }
}
