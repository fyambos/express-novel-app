import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';
import { CommentService } from 'src/app/services/comment.service';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
})
export class CommentsComponent {
  @Input() comment!: Comment;
  currentUserUid: string | null = null;
  isReplying: boolean = false;
  newReplyText: string = '';
  
  constructor(
    private commentService: CommentService,
    private auth: Auth,
    private userService: UserService,
  ) {}

  async ngOnInit() {
    this.checkCurrentUser();
  }

  checkCurrentUser() {
      onAuthStateChanged(this.auth, (user: User | null) => {
        if (user) {
          this.currentUserUid = user.uid;
        } else {
        }
      });
  }
  openReplyForm(): void {
    this.isReplying = true;
    this.newReplyText = '';
  }

  async submitReply(comment: any): Promise<void> {
    if (!this.newReplyText.trim()) {
      return;
    }
    const newReply = {
      text: this.newReplyText.trim(),
      authorId: this.currentUserUid,
      replyTo: comment.id,
      chapterId: comment.chapterId,
    };
    this.commentService.addComment(newReply).then(async (newComment) => {
      if (!comment.replies) {
        comment.replies = [];
      }
      newComment.author = await this.userService.fetchUser(newComment.authorId);
      comment.replies.push(newComment);
      this.isReplying = false;
    }).catch((error) => {
      console.error('Error submitting reply:', error);
    });
  }
}
