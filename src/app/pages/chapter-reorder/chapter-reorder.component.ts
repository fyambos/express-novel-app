import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChapterService } from 'src/app/services/chapter.service';
import { ActivatedRoute, Router } from '@angular/router'; 
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth'; 

@Component({
  selector: 'app-chapter-reorder',
  templateUrl: './chapter-reorder.component.html',
})
export class ChapterReorderComponent implements OnInit {
  chapters: any[] = [];
  storyId: string = "";
  currentUserUid: string | null = null;
  isLoading: boolean = true;

  constructor(
    private chapterService: ChapterService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth,
   ) {}

  async ngOnInit(): Promise<void> {
    onAuthStateChanged(this.auth, (user: User | null) => {
          if (user) {
            this.currentUserUid = user.uid;
          }
    });
    this.storyId = this.route.snapshot.paramMap.get('id') ?? '';

    if (this.storyId) {
      try {
        const chaptersData = await this.chapterService.getChaptersByStoryId(this.storyId);
        this.chapters = chaptersData;
        if (this.chapters.length === 0) {
          this.router.navigate([`/stories/${this.storyId}`]);
        } else if (this.chapters[0].authorId !== this.currentUserUid) {
          this.router.navigate([`/not-found`]);
        }
        this.isLoading = false;
      } catch (error) {
        this.router.navigate([`/not-found`]);
      }
      
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
