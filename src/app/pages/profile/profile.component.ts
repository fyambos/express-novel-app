import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponent } from 'src/app/components/edit-profile-dialog/edit-profile-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  userIdFromParams: string | null = null;

  constructor(
    private userService: UserService,
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.userIdFromParams = this.route.snapshot.paramMap.get('id');
    this.fetchUserProfile();
  }
  async fetchUserProfile() {
    try {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        this.user = await this.userService.fetchUser(currentUser.uid);
        this.isLoading = false;
        if(!this.userIdFromParams) {
          this.userIdFromParams = this.user.id;
        }
      } else {
        this.router.navigate(['/login']);
      }
    } catch (error) {
      this.errorMessage = 'Error fetching user profile. Please try again later.';
      this.isLoading = false;
      console.error(error);
    }
  }

  openEditDialog(): void {
    // Open the dialog and pass the user data to prefill the form
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '400px',
      data: { user: this.user }
    });

    dialogRef.afterClosed().subscribe((updatedUser) => {
      if (updatedUser) {
        this.user = updatedUser;
        this.userService.updateUser(this.user.id, this.user.username, this.user.bio).then(() => {
        }).catch(error => {
          console.error('Error saving user theme:', error);
        });
      }
    });
  }
}
