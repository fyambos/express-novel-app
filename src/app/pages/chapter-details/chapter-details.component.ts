import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterService } from 'src/app/services/chapter.service';

@Component({
  selector: 'app-chapter-details',
  templateUrl: './chapter-details.component.html',
})
export class ChapterDetailsComponent implements OnInit {
  chapter: any = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private chapterService: ChapterService,
    private router: Router
  ) {}

  async ngOnInit() {
    const chapterId = this.route.snapshot.paramMap.get('id');
    if (chapterId) {
      await this.fetchChapter(chapterId);
    }
  }

  async fetchChapter(chapterId: string) {
    try {
      const chapterData = await this.chapterService.getChapterById(chapterId);
      this.chapter = { ...chapterData };
      if (!chapterData) {
        throw new Error('Chapter not found');
      }
      this.chapter = { ...chapterData };
    } catch (error) {
      console.error('Error fetching chapter:', error);
      this.router.navigate(['/not-found']);
    } finally {
      this.isLoading = false;
    }
  }
}
