import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoryService } from 'src/app/services/story.service';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { StoryDialogComponent } from '../../components/story-dialog/story-dialog.component';
import { ChapterDialogComponent } from '../../components/chapter-dialog/chapter-dialog.component';
import { ChapterService } from 'src/app/services/chapter.service';
import { UsersModalComponent } from 'src/app/components/users-modal/users-modal.component';
import { UserService } from 'src/app/services/user.service';

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
    private userService: UserService,
  ) {}

  async ngOnInit() {
    const storyId = this.route.snapshot.paramMap.get('id');
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
      const aggregatedLikes = chaptersData.reduce((likes: any, chapter: any) => {
        return likes.concat(chapter.likes || []);
      }, []);
      this.story = { ...this.story, chapters: chaptersData, likes: aggregatedLikes };
      const wordCount = this.storyService.getStoryWordCount(this.story);
      this.story = { ...this.story, wordCount };
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

  onChapterSelect(chapterId: string): void {
    if (chapterId) {
      this.router.navigate(['/chapters', chapterId]);
    }
  }
  
  onFullStoryRedirect(storyId: string): void {
    if (storyId) {
      this.router.navigate(['/full-story', storyId]);
    }
  }


    async openLikesModal(userIds: string[]): Promise<void> {
      try {
        const userIdsSet = Array.from(new Set(userIds));
        const userProfiles = await Promise.all(
          userIdsSet.map(async (userId) => {
            return await this.userService.fetchUser(userId);
          })
        );
        console.log(userProfiles)
        this.dialog.open(UsersModalComponent, {
          width: '400px',
          data: {
            users: userProfiles,
            title: 'Users who liked this story',
          },
        });
      } catch (error) {
        console.error('Error fetching user profiles:', error);
      }
    }

    navigateToReorderChapters(storyId: string) {
      if (storyId) {
        this.router.navigate(['/reorder-chapters', storyId]);
      }
    }
}
