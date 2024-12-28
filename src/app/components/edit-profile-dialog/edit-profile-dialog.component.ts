import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
})
export class EditProfileDialogComponent {
  user: any;

  constructor(
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = { ...data.user };
    this.user.interestsString = this.user.interests 
      ? this.user.interests.join(', ') 
      : '';
    console.log('User data:', this.user);
  }

  saveChanges(): void {
    this.user.interests = this.user.interestsString
      ? this.user.interestsString.split(',').map((s: string) => s.trim())
      : [];
    this.dialogRef.close(this.user);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
