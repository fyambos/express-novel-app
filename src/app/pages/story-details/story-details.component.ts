import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoryService } from 'src/app/services/story.service';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { StoryDialogComponent } from '../../components/story-dialog/story-dialog.component';
import { ChapterDialogComponent } from '../../components/chapter-dialog/chapter-dialog.component';
import { ChapterService } from 'src/app/services/chapter.service';

@Component({
  selector: 'app-story-details',
  templateUrl: './story-details.component.html',
})
export class StoryDetailsComponent implements OnInit {
  story: any = null;
  isAuthor: boolean = false;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private storyService: StoryService,
    private router: Router,
    private auth: Auth,
    private dialog: MatDialog,
    private chapterService: ChapterService,
  ) {}

  async ngOnInit() {
    const storyId = this.route.snapshot.paramMap.get('storyId');
    if (storyId) {
      await this.fetchStory(storyId);
      await this.fetchStoryChapters(storyId);
      this.checkCurrentUser();
    }
  }
  checkCurrentUser() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.isAuthor = user.uid === this.story?.author.id;
        this.isLoading = false;
      } else {
        this.isAuthor = false;
        this.isLoading = false;
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

  async fetchStoryChapters(storyId: string) {
    try {
      const chaptersData = await this.chapterService.getChaptersByStoryId(storyId);
      this.story = { ...this.story, chapters: chaptersData };
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

  openChapterModal(storyId: string, chapterId?: string) {
    let dialogData: any = { storyId };  
    if (chapterId) {
      dialogData._id = chapterId;
    }
  
    const dialogRef = this.dialog.open(ChapterDialogComponent, {
      width: '100vw',
      height: '100vh',
      data: dialogData
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }

  onChapterSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const chapterId = selectElement.value;
    if (chapterId) {
      this.router.navigate(['/chapters', chapterId]);
    }
  }
}
