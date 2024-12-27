import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-story-dialog',
  templateUrl: './story-dialog.component.html',
})
export class StoryDialogComponent {
  title: string = '';
  summary: string = '';
  rating: string = '';
  tags: string = '';

  constructor(
    public dialogRef: MatDialogRef<StoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data) {
      this.title = this.data.title || '';
      this.summary = this.data.summary || '';
      this.rating = this.data.rating || '';
      this.tags = this.data.tags || '';
    }
  }

  onSubmit() {
    const story = {
      title: this.title,
      summary: this.summary,
      rating: this.rating,
      tags: this.tags.split(',').map(tag => tag.trim())
    };

    this.dialogRef.close(story);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
