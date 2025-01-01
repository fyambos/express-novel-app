import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StoryDialogComponent } from '../story-dialog/story-dialog.component';
import { UserService } from '../../services/user.service';
import { MessageService } from 'src/app/services/message.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  dropdownOpen = false;
  user: User | null = null;
  userProfile: any = null;
  unreadMessages: number = 0;
  unreadNotifications: number = 0;
  private routerSub: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private auth: Auth,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
    private messageService: MessageService,
    private notificationService: NotificationService,
  ) {}

  async ngOnInit() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark');
    } else {
      this.isDarkMode = false;
      document.body.classList.remove('dark');
    }
  
    this.auth.onAuthStateChanged(async user => {
      this.user = user;
      if (user) {
        const creationTime = new Date(user.metadata.creationTime!).getTime();
        const currentTime = Date.now();
        if (currentTime - creationTime < 300000) {
          return; // don't fetch user profile if account was created less than 5 minutes ago
        }
        try {
          this.userProfile = await this.userService.fetchUser(user.uid);
          if (this.userProfile) {
            this.loadUserTheme(user.uid);
            this.loadUnreads(user.uid);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    });

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.user) {
          this.loadUnreads(this.user.uid);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  loadUserTheme(userId: string) {
    this.userService.fetchUser(userId).then(userData => {
      if (!localStorage.getItem('theme')) {
        this.isDarkMode = userData.theme === 'dark';
        document.body.classList.toggle('dark', this.isDarkMode);
      }
    }).catch(error => {
      console.error('Error loading user theme:', error);
    });
  }

  saveUserTheme(userId: string, theme: string) {
    this.userService.saveUserTheme(userId, theme).then(() => {
    }).catch(error => {
      console.error('Error saving user theme:', error);
    });
  }

toggleDarkMode() {
  this.isDarkMode = !this.isDarkMode;
  document.body.classList.toggle('dark', this.isDarkMode);
  localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  if (this.user) {
    this.saveUserTheme(this.user.uid, this.isDarkMode ? 'dark' : 'light');
  }
}
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  handleLogout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/']);
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
    });
  }

  async loadUnreads(userId: string): Promise<void> {
    if (userId) {
      this.unreadMessages = await this.messageService.getUnreadMessageCount(userId);
      this.unreadNotifications = await this.notificationService.getUnreadNotificationCount(userId);
    }
  }
}
