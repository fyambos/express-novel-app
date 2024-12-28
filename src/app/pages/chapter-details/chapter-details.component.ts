import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterService } from 'src/app/services/chapter.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chapter-details',
  templateUrl: './chapter-details.component.html',
})
export class ChapterDetailsComponent implements OnInit {
  chapter: any = null;
  isLoading: boolean = true;
  safeContent: SafeHtml = '';
  private routeSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private chapterService: ChapterService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(async (paramMap) => {
      const chapterId = paramMap.get('id');
      if (chapterId) {
        await this.fetchChapter(chapterId);
      }
    });
  }

  async fetchChapter(chapterId: string) {
    try {
      const chapterData = await this.chapterService.getChapterById(chapterId);
      this.chapter = { ...chapterData };
      if (!chapterData) {
        throw new Error('Chapter not found');
      }
      this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.chapter.content);
      await this.fetchStoryChapters(this.chapter.storyId);
    } catch (error) {
      console.error('Error fetching chapter:', error);
      this.router.navigate(['/not-found']);
    } finally {
      this.isLoading = false;
    }
  }

  async fetchStoryChapters(storyId: string) {
    try {
      const chaptersData = await this.chapterService.getChaptersByStoryId(storyId);
      this.chapter.story.chapters = chaptersData ;
    } catch (error) {
      console.error('Error fetching story:', error);
      this.router.navigate(['/not-found']);
    }
  }

  onChapterSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const chapterId = selectElement.value;
    if (chapterId) {
      this.router.navigate(['/chapters', chapterId]);
    }
  }
}
