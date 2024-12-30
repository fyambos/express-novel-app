import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, deleteUser } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private snackBar: MatSnackBar) {}

  signIn(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.snackBar.open('Logged in successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      })
      .catch((error) => {
        this.snackBar.open((error as Error).message, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      });
  }

  async signUp(email: string, password: string): Promise<User | null> { 
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user: User = userCredential.user; 
      this.snackBar.open('Account created successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
      return user; 
    } catch (error) {
      this.snackBar.open((error as Error).message, 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      throw error;
    }
  }

  logout(): Promise<void> {
    return signOut(this.auth).then(() => {
      this.snackBar.open('Logged out successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
    });
  }
  async deleteAccount(): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      try {
        await deleteUser(currentUser);
        this.snackBar.open('Account deleted successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      } catch (error) {
        this.snackBar.open('Failed to delete account: ' + (error as Error).message, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        throw error;
      }
    } else {
      this.snackBar.open('No user is currently authenticated.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  async forceReauthentication(): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      const authTimeInMillis = (currentUser.metadata.lastSignInTime) 
        ? new Date(currentUser.metadata.lastSignInTime).getTime() 
        : 0;
      const currentTimeInMillis = new Date().getTime();
      const timeElapsedInMillis = currentTimeInMillis - authTimeInMillis;
      const FIVE_MINUTES_IN_MILLIS = 300000;
      if (timeElapsedInMillis < FIVE_MINUTES_IN_MILLIS) {
        return;
      }
      await this.logout();
      this.snackBar.open('Please log in again to continue.', 'Close', {
        duration: 3000,
        panelClass: ['warning-snackbar'],
      });
    } else {
      this.snackBar.open('No user is currently authenticated.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }
}
