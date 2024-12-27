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
  isOwnProfile: boolean = false;

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
      this.auth.onAuthStateChanged(async (currentUser) => {
        if (!currentUser) { //no user
          this.isOwnProfile = false;
        } else if (!this.userIdFromParams) {  //profile
          this.isOwnProfile = true;
          this.userIdFromParams = currentUser.uid; 
        } else if (this.userIdFromParams === currentUser.uid) { //own profile
          this.isOwnProfile = true;
        } else { //other user profile
          this.isOwnProfile = false;
        }
        if (this.userIdFromParams) {
          this.user = await this.userService.fetchUser(this.userIdFromParams);
          this.isLoading = false;
        }
      });
    } catch (error) {
      this.errorMessage = 'Error fetching user profile. Please try again later.';
      this.isLoading = false;
      console.error(error);
    }
  }

  openEditDialog(): void {
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
