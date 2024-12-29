import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterService } from 'src/app/services/chapter.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { ChapterDialogComponent } from 'src/app/components/chapter-dialog/chapter-dialog.component';
import { Comment } from 'src/app/models/comment.model';
import { CommentService } from 'src/app/services/comment.service';
import { AddCommentDialogComponent } from 'src/app/components/add-comment-dialog/add-comment-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { StoryService } from 'src/app/services/story.service';
import { BookmarkService } from 'src/app/services/bookmark.service';
import { UsersModalComponent } from 'src/app/components/users-modal/users-modal.component';

@Component({
  selector: 'app-chapter-details',
  templateUrl: './chapter-details.component.html',
})
export class ChapterDetailsComponent implements OnInit {
  chapter: any = null;
  isLoading: boolean = true;
  safeContent: SafeHtml = '';
  routeSub: Subscription | null = null;
  previousChapterId: string | null = null;
  nextChapterId: string | null = null;
  isAuthor: boolean = false;
  comments: Comment[] = [];
  currentUserUid: string | null = null;
  isBookmarked: boolean = false;
  isMarkedAsRead: boolean = false;
  isLiked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private chapterService: ChapterService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private auth: Auth,
    private dialog: MatDialog,
    private commentService: CommentService,
    private userService: UserService,
    private storyService: StoryService,
    private bookmarkService: BookmarkService,
  ) {}

  async ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(async (paramMap) => {
      const chapterId = paramMap.get('id');
      if (chapterId) {
        await this.fetchChapter(chapterId);
        this.checkCurrentUser();
        this.comments = await this.commentService.getCommentsByChapterId(chapterId);
        if(this.currentUserUid) {
          this.checkIfBookmarked();
          this.checkIfMarkedAsRead();
          this.checkIfLiked(this.chapter._id, this.currentUserUid);
        }
      }
    });
  }

  checkCurrentUser() {
      onAuthStateChanged(this.auth, (user: User | null) => {
        if (user) {
          this.isAuthor = user.uid === this.chapter?.authorId;
          this.isLoading = false;
          this.currentUserUid = user.uid;
          this.checkIfBookmarked();
          this.checkIfMarkedAsRead();
          this.checkIfLiked(this.chapter._id, this.currentUserUid);
        } else {
          this.isLoading = false;
        }
      });
  }

  async fetchChapter(chapterId: string) {
    try {
      const chapterData = await this.chapterService.getChapterById(chapterId);
      const wordCount = this.storyService.getChapterWordCount(chapterData);
      this.chapter = { ...chapterData, wordCount };
      if (!chapterData) {
        throw new Error('Chapter not found');
      }
      this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.chapter.content);
      await this.fetchStoryChapters(this.chapter.storyId);
      this.updateNavigation();
    } catch (error) {
      console.error('Error fetching chapter:', error);
      this.router.navigate(['/not-found']);
    }
  }

  async fetchStoryChapters(storyId: string) {
    try {
      const chaptersData = await this.chapterService.getChaptersByStoryId(storyId);
      this.chapter.story.chapters = chaptersData.sort((a: any, b: any) => a.chapter - b.chapter);
    } catch (error) {
      console.error('Error fetching story:', error);
      this.router.navigate(['/not-found']);
    }
  }

  updateNavigation() {
    const currentIndex = this.chapter.story.chapters.findIndex((ch: any) => ch._id === this.chapter._id);

    if (currentIndex > 0) {
      this.previousChapterId = this.chapter.story.chapters[currentIndex - 1]._id;
    } else {
      this.previousChapterId = null;
    }

    if (currentIndex < this.chapter.story.chapters.length - 1) {
      this.nextChapterId = this.chapter.story.chapters[currentIndex + 1]._id;
    } else {
      this.nextChapterId = null;
    }
  }

  navigateToChapter(chapterId: string): void {
    this.router.navigate(['/chapters', chapterId]).then(() => {
      this.fetchChapter(chapterId);
    });
  }

  onChapterSelect(chapterId: string): void {
    this.navigateToChapter(chapterId);
  }

  onFullStoryRedirect(storyId: string): void {
    if (storyId) {
      this.router.navigate(['/full-story', storyId]);
    }
  }

  openEditModal(chapter: any) {
      const dialogRef = this.dialog.open(ChapterDialogComponent, {
        width: '100vw',
        height: '100vh',
        data: chapter,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          
        }
      });
    }

    async openCommentModal() {
    const dialogRef = this.dialog.open(AddCommentDialogComponent, {
      width: '400px',
      data: { chapterId: this.chapter._id, authorId: this.currentUserUid },
    });

    dialogRef.afterClosed().subscribe(async (newComment) => {
      if (newComment) {
        newComment.author = await this.userService.fetchUser(newComment.authorId);
        this.comments.push(newComment);
      }
    });
  }

  async toggleBookmark(storyId: string, chapterId: string) {
    if(!this.currentUserUid) {
      return;
    }
    const userId = this.currentUserUid;
    try {
      const bookmarks = await this.bookmarkService.getBookmarksByUserId(userId, 'bookmark');
      const existingBookmark = bookmarks.find(bookmark => bookmark.storyId === storyId);

      if (existingBookmark) {
        if (existingBookmark.chapterId === chapterId) {
          await this.bookmarkService.deleteBookmark(existingBookmark._id, 'bookmark'); //delete bookmark if already bookmarked
          this.isBookmarked = false;
        } else {
          await this.bookmarkService.deleteBookmark(existingBookmark._id, 'bookmark');
          await this.bookmarkService.createBookmark(this.currentUserUid, chapterId, storyId, 'bookmark'); //update bookmark if different chapter
          this.isBookmarked = true;
        }
      } else {
        await this.bookmarkService.createBookmark(this.currentUserUid, chapterId, storyId, 'bookmark'); //create bookmark if not already bookmarked
        this.isBookmarked = true;
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  }

  async checkIfBookmarked() {
    if(!this.currentUserUid) {
      return;
    }
    const userId = this.currentUserUid;
    const chapterId = this.chapter._id;
    const storyId = this.chapter.storyId;
    try {
      const bookmarks = await this.bookmarkService.getBookmarksByUserId(userId, 'bookmark');
      const existingBookmark = bookmarks.find(bookmark => bookmark.storyId === storyId);
      if (existingBookmark && existingBookmark.chapterId === chapterId) {
          this.isBookmarked = true;
      } else {
        this.isBookmarked = false;
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  }

  async toggleMarkAsRead(storyId: string) {
    if(!this.currentUserUid) {
      return;
    }
    const userId = this.currentUserUid;
    try {
      const bookmarks = await this.bookmarkService.getBookmarksByUserId(userId, 'read');
      const existingBookmark = bookmarks.find(bookmark => bookmark.storyId === storyId);

      if (existingBookmark) {
        await this.bookmarkService.deleteBookmark(existingBookmark._id, 'read'); //delete bookmark if not already bookmarked
        this.isMarkedAsRead = false;
      } else {
        await this.bookmarkService.createBookmark(this.currentUserUid, null, storyId, 'read'); //create bookmark if not already bookmarked
        this.isMarkedAsRead = true;
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  }

  async checkIfMarkedAsRead() {
    if(!this.currentUserUid) {
      return;
    }
    const userId = this.currentUserUid;
    const storyId = this.chapter.storyId;
    try {
      const bookmarks = await this.bookmarkService.getBookmarksByUserId(userId, 'read');
      const existingBookmark = bookmarks.find(bookmark => bookmark.storyId === storyId);
      if (existingBookmark) {
        this.isMarkedAsRead = true;
      } else {
        this.isMarkedAsRead = false;
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  }

  moveToTop() {
    window.scrollTo(0, 0);
  }

  async likeChapter(chapterId: string, userId: string | null) {
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }
    try {
      const response = await this.chapterService.toggleLikeChapter(chapterId, userId);
      this.isLiked = await this.chapterService.checkIfLiked(chapterId, userId);
      this.chapter.likes = response.likes;
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }

  async checkIfLiked(chapterId: string, userId: string) {
    try {
      this.isLiked = await this.chapterService.checkIfLiked(chapterId, userId);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  }
  

  async openLikesModal(userIds: string[]): Promise<void> {
    try {
      const userProfiles = await Promise.all(
        userIds.map(async (userId) => {
          return await this.userService.fetchUser(userId);
        })
      );
      console.log(userProfiles)
      this.dialog.open(UsersModalComponent, {
        width: '400px',
        data: {
          users: userProfiles,
          title: 'Users who liked this chapter',
        },
      });
    } catch (error) {
      console.error('Error fetching user profiles:', error);
    }
  }
}
