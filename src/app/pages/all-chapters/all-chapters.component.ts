import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterService } from 'src/app/services/chapter.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { StoryService } from 'src/app/services/story.service';

@Component({
  selector: 'app-all-chapters',
  templateUrl: './all-chapters.component.html',
})
export class AllChaptersComponent implements OnInit {
  story: any = null;
  chapters: any = null;
  isLoading: boolean = true;
  safeContent: SafeHtml = '';
  routeSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private chapterService: ChapterService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private storyService: StoryService,
  ) {}

  async ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(async (paramMap) => {
      const storyId = paramMap.get('id');
      if (storyId) {
        await this.fetchStory(storyId);
        await this.fetchChapters(storyId);
      }
    });
  }

  async fetchStory(storyId: string) {
    try {
      const storyData = await this.storyService.getStoryById(storyId);
      if (!storyData) {
        throw new Error('Story not found');
      }
      this.story = storyData;
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(['/not-found']);
      } else {
        console.error('Unexpected error fetching story:', error);
      }
    }
  }

  async fetchChapters(storyId: string) {
    try {
      const chaptersData = await this.chapterService.getChaptersByStoryId(storyId);
      if (!chaptersData) {
        throw new Error('Chapters not found');
      }
      const aggregatedLikes = chaptersData.reduce((likes: any, chapter: any) => {
        return likes.concat(chapter.likes || []);
      }, []);
      this.story = { ...this.story, chapters: chaptersData, likes: aggregatedLikes };
      const wordCount = this.storyService.getStoryWordCount(this.story);
      this.story = { ...this.story, wordCount };
      this.chapters = chaptersData;
      for (let i = 0; i < this.chapters.length; i++) {
        this.chapters[i].content = this.sanitizer.bypassSecurityTrustHtml(this.chapters[i].content);
      }
      this.isLoading = false;
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(['/not-found']);
      } else {
        console.error('Unexpected error fetching story:', error);
      }
    }
  }

  moveToTop() {
    window.scrollTo(0, 0);
  }

  
  onChapterSelect(chapterId: string): void {
    if (chapterId) {
      this.router.navigate(['/chapters', chapterId]);
    }
  }
}
