import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Comment } from 'src/app/models/comment.model';
import { CommentService } from 'src/app/services/comment.service';
import { AddCommentDialogComponent } from 'src/app/components/add-comment-dialog/add-comment-dialog.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
})
export class CommentComponent implements OnInit {
  isLoading: boolean = true;
  routeSub: Subscription | null = null;
  comments: Comment[] = [];
  currentUserUid: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth,
    private dialog: MatDialog,
    private commentService: CommentService,
    private userService: UserService,
  ) {}

  async ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(async (paramMap) => {
      const commentId = paramMap.get('id');
      if (commentId) {
        this.checkCurrentUser();
        this.comments = await this.commentService.getCommentById(commentId);
        console.log("this.comments", this.comments);
      }
    });
  }

  checkCurrentUser() {
      onAuthStateChanged(this.auth, (user: User | null) => {
        if (user) {
          this.isLoading = false;
          this.currentUserUid = user.uid;
        } else {
          this.isLoading = false;
        }
      });
  }

    async openCommentModal() {
    if (!this.currentUserUid) {
      this.router.navigate(['/login']);
      return;
    }
    const dialogRef = this.dialog.open(AddCommentDialogComponent, {
      width: '400px',
      data: { chapterId: this.comments[0].chapterId, authorId: this.currentUserUid },
    });

    dialogRef.afterClosed().subscribe(async (newComment) => {
      if (newComment) {
        newComment.author = await this.userService.fetchUser(newComment.authorId);
        this.comments.push(newComment);
      }
    });
  }

}
