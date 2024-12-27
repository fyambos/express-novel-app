import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StoryDialogComponent } from '../story-dialog/story-dialog.component';

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
