import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoryService } from 'src/app/services/story.service';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { StoryDialogComponent } from '../../components/story-dialog/story-dialog.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-story-details',
  templateUrl: './story-details.component.html',
})
export class StoryDetailsComponent implements OnInit {
  story: any = null;
  isAuthor: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private storyService: StoryService,
    private router: Router,
    private auth: Auth,
    private dialog: MatDialog,
    private userService: UserService,
  ) {}

  async ngOnInit() {
    const storyId = this.route.snapshot.paramMap.get('storyId');
    if (storyId) {
      await this.fetchStory(storyId);
      this.checkCurrentUser();
    }
  }
  checkCurrentUser() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.isAuthor = user.uid === this.story?.author.id;
      } else {
        this.isAuthor = false;
      }
    });
  }
  async fetchStory(storyId: string) {
    try {
      const storyData = await this.storyService.getStoryById(storyId);
      this.story = { ...storyData };
    } catch (error) {
      console.error('Error fetching story:', error);
      this.router.navigate(['/not-found']);
    }
  }

  openEditModal(story: any) {
    const dialogRef = this.dialog.open(StoryDialogComponent, {
      width: '100vw',
      height: '100vh',
      data: story,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Story Edited:', result);
      }
    });
  }
}
