import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterService } from 'src/app/services/chapter.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-chapters',
  templateUrl: './all-chapters.component.html',
})
export class AllChaptersComponent implements OnInit {
  chapters: any = null;
  isLoading: boolean = true;
  safeContent: SafeHtml = '';
  routeSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private chapterService: ChapterService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}

  async ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(async (paramMap) => {
      const storyId = paramMap.get('id');
      if (storyId) {
        await this.fetchChapters(storyId);
      }
    });
  }

  async fetchChapters(storyId: string) {
    try {
      const chaptersData = await this.chapterService.getChaptersByStoryId(storyId);
      if (!chaptersData) {
        throw new Error('Chapter not found');
      }
      this.chapters = chaptersData.sort((a: any, b: any) => a.chapter - b.chapter);
      console.log('Chapters:', this.chapters);
      for (let i = 0; i < this.chapters.length; i++) {
        this.chapters[i].content = this.sanitizer.bypassSecurityTrustHtml(this.chapters[i].content);
      }
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching story:', error);
      this.router.navigate(['/not-found']);
    }
  }

  moveToTop() {
    window.scrollTo(0, 0);
  }
}
