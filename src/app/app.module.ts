import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/env.dev';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HeaderComponent } from './components/header/header.component';
import { StoryDialogComponent } from './components/story-dialog/story-dialog.component';
import { StoryDetailsComponent } from './pages/story-details/story-details.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileDialogComponent } from './components/edit-profile-dialog/edit-profile-dialog.component';
import { StoryCardComponent } from './components/story-card/story-card.component';
import { ChapterDialogComponent } from './components/chapter-dialog/chapter-dialog.component';
import { ChapterDetailsComponent } from './pages/chapter-details/chapter-details.component';
import { ContentEditableDirective } from './directives/content-editable.directive';
import { AllChaptersComponent } from './pages/all-chapters/all-chapters.component';
import { CommentsComponent } from './components/comments/comments.component';
import { AddCommentDialogComponent } from './components/add-comment-dialog/add-comment-dialog.component';
import { RelativeDatePipe } from './pipes/relative-date.pipe';
import { UsersModalComponent } from './components/users-modal/users-modal.component';
import { ChapterReorderComponent } from './pages/chapter-reorder/chapter-reorder.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MessageComponent } from './pages/message/message.component';
import { ConversationsComponent } from './pages/conversations/conversations.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    StoryDialogComponent,
    StoryDetailsComponent,
    HomeComponent,
    NotFoundComponent,
    ProfileComponent,
    EditProfileDialogComponent,
    StoryCardComponent,
    ChapterDialogComponent,
    ChapterDetailsComponent,
    ContentEditableDirective,
    AllChaptersComponent,
    CommentsComponent,
    AddCommentDialogComponent,
    RelativeDatePipe,
    UsersModalComponent,
    ChapterReorderComponent,
    BookmarksComponent,
    ConfirmDialogComponent,
    MessageComponent,
    ConversationsComponent,
    SettingsComponent,
    NotificationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSnackBarModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatDialogModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
