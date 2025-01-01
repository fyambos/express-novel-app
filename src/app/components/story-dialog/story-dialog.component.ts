import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoryService } from 'src/app/services/story.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-story-dialog',
  templateUrl: './story-dialog.component.html',
})
export class StoryDialogComponent implements OnInit {
  title: string = '';
  summary: string = '';
  rating: string = '';
  tags: string = '';
  isEditing: boolean = false;
  currentUser: User | null = null;

  constructor(
    public dialogRef: MatDialogRef<StoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storyService: StoryService,
    private router: Router,
    private auth: Auth
  ) {}

  async ngOnInit() {
    this.currentUser = this.auth.currentUser;

    if (!this.currentUser) {
      console.error('No authenticated user found');
      return;
    }

    if (this.data?._id) {
      this.isEditing = true;
      await this.loadStoryDetails(this.data._id);
    }
  }

  async loadStoryDetails(storyId: string) {
    try {
      const story = await this.storyService.getStoryById(storyId);
      this.title = story.title;
      this.summary = story.summary;
      this.rating = story.rating;
      this.tags = story.tags.join(', ');
    } catch (error) {
      console.error('Error fetching story', error);
    }
  }

  async onSubmit() {
    if (!this.currentUser) {
      console.error('Cannot submit story without an authenticated user');
      return;
    }

    const story = {
      title: this.title,
      summary: this.summary,
      rating: this.rating,
      tags: this.tags.split(',').map((tag) => tag.trim()),
      authorId: this.currentUser.uid,
    };

    try {
      if (this.isEditing) {
        const updatedStory = await this.updateStory(this.data._id, story);
        this.dialogRef.close(updatedStory);
        this.router.navigate([`/stories/${updatedStory._id}`]);
      } else {
        const newStory = await this.createStory(story);
        this.dialogRef.close(newStory);
        this.router.navigate([`/stories/${newStory._id}`]);
      }
    } catch (error) {
      console.error('Error submitting story', error);
    }
  }

  async createStory(story: any) {
    try {
      const newStory = await this.storyService.createStory(story);
      return newStory;
    } catch (error) {
      console.error('Error creating story', error);
      throw error;
    }
  }

  async updateStory(storyId: string, story: any) {
    try {
      const updatedStory = await this.storyService.editStory(storyId, story);
      return updatedStory;
    } catch (error) {
      console.error('Error updating story', error);
      throw error;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
