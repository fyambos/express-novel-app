import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
})
export class EditProfileDialogComponent {
  user: any;
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
  ) {
    this.user = { ...data.user };
    this.user.interestsString = this.user.interests 
      ? this.user.interests.join(', ') 
      : '';
    console.log('User data:', this.user);
  }

  async saveChanges(): Promise<void> {
    this.user.interests = this.user.interestsString
      ? this.user.interestsString.split(',').map((s: string) => s.trim())
      : [];
    
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('profilePicture', this.selectedFile);
      try {
        const response = await this.userService.uploadProfilePicture(this.user.id, formData);
        this.user.profilePicture = response.profilePicture;
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  
    this.dialogRef.close(this.user);
  }
  

  closeDialog(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
}
