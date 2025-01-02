import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Comment } from 'src/app/models/comment.model';
import { CommentService } from 'src/app/services/comment.service';

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
    private auth: Auth,
    private commentService: CommentService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(async (paramMap) => {
      const commentId = paramMap.get('id');
      if (commentId) {
        this.checkCurrentUser();
        this.comments = await this.commentService.getCommentById(commentId);
        console.log("component's comments:", this.comments);
        if (this.comments && this.comments.length > 0 && this.comments[0]?.deleted === true && !this.comments[0]?.replies) {
          this.router.navigate(['/not-found']);
        }
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

}
