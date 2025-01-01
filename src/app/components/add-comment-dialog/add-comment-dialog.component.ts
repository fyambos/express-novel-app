import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-add-comment-dialog',
  templateUrl: './add-comment-dialog.component.html',
})
export class AddCommentDialogComponent {
  commentText: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commentService: CommentService,
  ) {}

  async saveComment(): Promise<void> {
    if (!this.commentText.trim()) {
      return;
    }

    const commentData = {
      authorId: this.data.authorId,
      chapterId: this.data.chapterId,
      text: this.commentText,
      replyTo: this.data.replyTo || null,
    };

    this.commentService.addComment(commentData).then(async (newComment) => {
      newComment.id = newComment._id;
      this.dialogRef.close(newComment);
    }).catch((error) => {
      console.error('Error submitting reply:', error);
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
