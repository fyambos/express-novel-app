import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BookmarkService } from 'src/app/services/bookmark.service';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth'; 
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
    private dialog: MatDialog,
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm',
        message: 'Are you sure you want to delete this bookmark?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.bookmarkService.deleteBookmark(bookmarkId, this.actionType).then(() => {
          this.bookmarks = this.bookmarks.filter((bookmark: any) => bookmark._id !== bookmarkId);
        });
      }
    });
  }

}
