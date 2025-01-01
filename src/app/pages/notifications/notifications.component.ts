import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { Auth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { StoryService } from 'src/app/services/story.service';

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
    private storyService: StoryService,
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
              notification = {
                ...notification,
                actor: actorProfile,
              };
              if(notification.type === 'story') {
                const story = await this.storyService.getStoryById(notification.objectId);
                notification = {
                  ...notification,
                  objectName: story.title,
                };
              }
              return notification;
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
