import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { of, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
})
export class EditProfileDialogComponent implements OnInit {
  user: any;
  selectedFile: File | null = null;
  profileForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.user = { ...data.user };
    this.user.interestsString = this.user.interests 
      ? this.user.interests.join(', ') 
      : '';
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      username: [
        this.user.username,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z0-9._]*$/)
        ],
        [this.validateUsernameNotTaken.bind(this)]
      ],
      bio: [this.user.bio],
      interestsString: [this.user.interestsString],
    });
  }

  validateUsernameNotTaken(control: AbstractControl) {
    if (!control.value) {
      return of(null);
    }
    return from(this.userService.checkUsernameAvailability(control.value, this.user.id)).pipe(
      map((isAvailable: boolean) => (isAvailable ? null : { usernameTaken: true })),
      catchError(() => of({ usernameTaken: true })) 
    );
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
