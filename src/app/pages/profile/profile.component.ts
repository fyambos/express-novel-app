import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponent } from 'src/app/components/edit-profile-dialog/edit-profile-dialog.component';
import { BookmarkService } from 'src/app/services/bookmark.service';
import { StoryService } from 'src/app/services/story.service';
import { ChapterService } from 'src/app/services/chapter.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  userIdFromParams: string | null = null;
  isOwnProfile: boolean = false;
  stories: any[] = [];
  bookmarks: any[] = [];
  viewBookmarks: 'bookmarks' | 'stories' | 'read' = 'stories';
  reads: any[] = [];
  currentUserUid: string | null = null;
  isFollowing: boolean = false;

  constructor(
    private userService: UserService,
    private auth: Auth,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private bookmarkService: BookmarkService,
    private storyService: StoryService,
    private chapterService: ChapterService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userIdFromParams = this.route.snapshot.paramMap.get('id');
    this.fetchUserProfile();
    if (this.currentUserUid && this.userIdFromParams) {
      this.checkIfFollowed(this.userIdFromParams);
    }
  }

  async fetchUserProfile() {
    try {
      this.auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          this.currentUserUid = currentUser.uid;
        }
        if (!currentUser) {
          // no user
          this.isOwnProfile = false;
        } else if (!this.userIdFromParams) {
          // own profile
          this.isOwnProfile = true;
          this.userIdFromParams = currentUser.uid;
        } else if (this.userIdFromParams === currentUser.uid) {
          // own profile w. param
          this.isOwnProfile = true;
        } else {
          // other user profile
          this.isOwnProfile = false;
        }
        if (this.userIdFromParams) {
          this.fetchProfileInfo(this.userIdFromParams);
          if (this.currentUserUid) {
            this.checkIfFollowed(this.userIdFromParams);
          }
        }
      });
    } catch (error) {
      this.errorMessage = 'Error fetching user profile. Please try again later.';
      this.isLoading = false;
      console.error(error);
    }
  }

  async fetchProfileInfo(userId: string) {
    try {
      this.user = await this.userService.fetchUser(userId);
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(['/not-found']);
      } else {
        console.error('Unexpected error fetching profile:', error);
      }
    }
    
    this.stories = await this.userService.fetchAuthorStories(userId);
    const bookmarks = await this.bookmarkService.getBookmarksByUserId(userId, 'bookmark');
    for (const bookmark of bookmarks) {
      const story = await this.storyService.getStoryById(bookmark.storyId);
      const chapter = await this.chapterService.getChapterById(bookmark.chapterId); 
      bookmark.story = story;
      bookmark.chapter = chapter;
    }
    const reads = await this.bookmarkService.getBookmarksByUserId(userId, 'read');
    for (const read of reads) {
      const story = await this.storyService.getStoryById(read.storyId);
      read.story = story;
    }
    this.bookmarks = bookmarks;
    this.reads = reads;
    this.isLoading = false;
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '400px',
      data: { user: this.user },
    });

    dialogRef.afterClosed().subscribe((updatedUser) => {
      if (updatedUser) {
        this.user = updatedUser;
        this.user.interests = updatedUser.interestsString
        ? updatedUser.interestsString.split(',').map((s: string) => s.trim())
        : [];
        this.userService
          .updateUser(this.user.id, this.user.username, this.user.bio, this.user.interests)
          .then(() => {})
          .catch((error) => {
            console.error('Error saving user theme:', error);
          });
      }
    });
  }

  navigateToStory(storyId: string): void {
    this.router.navigate(['/stories', storyId]);
  }

  sendMessage(): void {
    this.router.navigate(['/messages', this.userIdFromParams]);
  }

  async followUser(userId: string) {
    if (!this.currentUserUid) {
      this.router.navigate(['/login']);
      return;
    }
    try {
      const response = await this.userService.toggleFollowUser(userId, this.currentUserUid);
      this.isFollowing = await this.userService.checkIfFollowed(userId, this.currentUserUid);
      this.user.followers = response.followers;
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  }
  
  async checkIfFollowed(userId: string) {
    if (!this.currentUserUid) {
      return;
    }
    try {
      this.isFollowing = await this.userService.checkIfFollowed(userId, this.currentUserUid);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  }

}
