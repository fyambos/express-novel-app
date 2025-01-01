import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { Auth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { StoryService } from 'src/app/services/story.service';
import { ChapterService } from 'src/app/services/chapter.service';
import { CommentService } from 'src/app/services/comment.service';

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
    private chapterService: ChapterService,
    private commentService: CommentService,
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
              };
              if(notification.type === 'comment') {
                const commentId = notification.objectId;
                const comment = await this.commentService.getCommentById(commentId);
                const chapterId = comment[0].chapterId;
                notification = {
                  ...notification,
                  objectName: chapterId,
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
