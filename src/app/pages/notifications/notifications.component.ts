import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { Auth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  notifications: any = [];
  currentUserUid: string | null = null;

  constructor(
    private notificationService: NotificationService,
    private auth: Auth,
    private userService: UserService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        this.currentUserUid = currentUser.uid;

        try {
          this.notifications = await this.notificationService.getNotifications(this.currentUserUid);
          this.notifications = await Promise.all(
            this.notifications.map(async (notification: any) => {
              const actorProfile = await this.userService.fetchUser(notification.actorId);
              return {
                ...notification,
                actor: actorProfile,
              };
            })
          );
          await this.notificationService.markNotificationsAsRead(this.currentUserUid);
        } catch (err) {
          console.error('Error loading notifications:', err);
        }
      }
    });
  }
}
