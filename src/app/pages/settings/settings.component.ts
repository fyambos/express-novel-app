import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  user: any = "";
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private auth: Auth,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.fetchUserSettings();
  }

  async fetchUserSettings() {
    try {
      this.auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          const userProfile = await this.userService.fetchUser(currentUser.uid);
          this.user = userProfile;
        } else {
          this.errorMessage = 'No authenticated user found.';
        }
        this.isLoading = false;
      });
    } catch (error) {
      this.errorMessage = 'Error fetching settings. Please try again later.';
      this.isLoading = false;
      console.error(error);
    }
  }

  

  deleteProfile(userId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm',
        message: 'Are you sure you want to delete your profile? This will NOT delete your stories and comments, they will be orphaned.',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.authService.forceReauthentication().then(() => {
          if(this.auth.currentUser) {
            this.userService.deleteUser(userId).then(() => {
              this.authService.deleteAccount().then(() => {
                this.router.navigate(['/']);
              }).catch((error) => {
                console.error('Failed to delete firebase account:', error);
              });
            }).catch((error) => {
              console.error('Failed to delete user', error);
            });
          } else {
            this.router.navigate(['/login']);
          }
        }).catch((error) => {
          console.error('Failed to reauthenticate:', error);
        });
      }
    });
  }
}
