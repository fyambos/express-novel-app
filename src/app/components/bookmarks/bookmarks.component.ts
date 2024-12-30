import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BookmarkService } from 'src/app/services/bookmark.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
})
export class BookmarksComponent {
  @Input() bookmarks: any;
  @Input() actionType: 'bookmark' | 'read' = 'bookmark';

  constructor(
    private router: Router,
    private bookmarkService: BookmarkService,
  ) {}
  
  navigateToChapter(chapterId: string): void {
    this.router.navigate(['/chapters', chapterId]);
  }
  
  navigateToStory(storyId: string): void {
    this.router.navigate(['/stories', storyId]);
  }

  deleteBookmark(bookmarkId: string): void {
    this.bookmarkService.deleteBookmark(bookmarkId, this.actionType).then(() => {
      this.bookmarks = this.bookmarks.filter((bookmark: any) => bookmark._id !== bookmarkId);
    });
  }
}
