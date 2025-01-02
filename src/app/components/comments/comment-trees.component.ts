import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';
import { CommentService } from 'src/app/services/comment.service';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment-trees',
  templateUrl: './comment-trees.component.html',
})
export class CommentTreesComponent {
  @Input() comment!: Comment;
  currentUserUid: string | null = null;
  isReplying: boolean = false;
  newReplyText: string = '';
  isLiked: boolean = false;

  constructor(
    private commentService: CommentService,
    private auth: Auth,
    private userService: UserService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.checkCurrentUser();
    if (this.currentUserUid) {
      this.checkIfLiked(this.comment.id, this.currentUserUid);
    }
  }

  checkCurrentUser() {
      onAuthStateChanged(this.auth, (user: User | null) => {
        if (user) {
          this.currentUserUid = user.uid;
          this.checkIfLiked(this.comment.id, this.currentUserUid);
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
      replyTo: comment._id,
      chapterId: comment.chapterId,
    };
    this.commentService.addComment(newReply).then(async (newComment) => {
      if (!comment.replies) {
        comment.replies = [];
      }
      newComment.author = await this.userService.fetchUser(newComment.authorId);
      newComment.id = newComment._id;
      comment.replies.push(newComment);
      this.isReplying = false;
    }).catch((error) => {
      console.error('Error submitting reply:', error);
    });
  }

  async likeComment(commentId: string, userId: string | null) {
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }
    try {
      const response = await this.commentService.toggleLikeComment(commentId, userId);
      this.isLiked = await this.commentService.checkIfLiked(commentId, userId);
      this.comment.likes = response.likes;
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }

  async checkIfLiked(commentId: string, userId: string) {
    try {
      this.isLiked = await this.commentService.checkIfLiked(commentId, userId);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  }
}
