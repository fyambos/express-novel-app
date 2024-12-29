import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChapterService } from 'src/app/services/chapter.service';
import { ActivatedRoute, Router } from '@angular/router'; 

@Component({
  selector: 'app-chapter-reorder',
  templateUrl: './chapter-reorder.component.html',
})
export class ChapterReorderComponent implements OnInit {
  chapters: any[] = [];
  storyId: string = "";

  constructor(
    private chapterService: ChapterService,
    private route: ActivatedRoute,
    private router: Router,
   ) {}

  async ngOnInit(): Promise<void> {
    this.storyId = this.route.snapshot.paramMap.get('id') ?? '';

    if (this.storyId) {
      const chaptersData = await this.chapterService.getChaptersByStoryId(this.storyId);
      this.chapters = chaptersData;
    }
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.chapters, event.previousIndex, event.currentIndex);
  }

  async saveOrder() {
    try {
      const updatedOrder = this.chapters.map((chapter, index) => ({
        chapterId: chapter._id,
        order: index + 1,
      }));
      await this.chapterService.updateChapterOrder(updatedOrder);
      this.router.navigate([`/stories/${this.storyId}`]);
    } catch (error) {
      console.error('Error saving chapter order:', error);
    }
  }
  
}
