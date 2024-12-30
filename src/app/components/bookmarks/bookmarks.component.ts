import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BookmarkService } from 'src/app/services/bookmark.service';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth'; 

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
})
export class BookmarksComponent {
  @Input() bookmarks: any;
  @Input() actionType: 'bookmark' | 'read' = 'bookmark';
  currentUserUid: string | null = null;

  constructor(
    private router: Router,
    private bookmarkService: BookmarkService,
    private auth: Auth,
  ) {}
  
  async ngOnInit() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.currentUserUid = user.uid;
      }
    });
  }

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
