import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { StoryDetailsComponent } from './pages/story-details/story-details.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ChapterDetailsComponent } from './pages/chapter-details/chapter-details.component';
import { AllChaptersComponent } from './pages/all-chapters/all-chapters.component';
import { ChapterReorderComponent } from './pages/chapter-reorder/chapter-reorder.component';
import { MessageComponent } from './pages/message/message.component';
import { ConversationsComponent } from './pages/conversations/conversations.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [noAuthGuard] },
  { path: 'stories/:id', component: StoryDetailsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'chapters/:id', component: ChapterDetailsComponent },
  { path: 'full-story/:id', component: AllChaptersComponent },
  { path: 'reorder-chapters/:id', component: ChapterReorderComponent, canActivate: [authGuard] },
  { path: 'messages', component: ConversationsComponent, canActivate: [authGuard] },
  { path: 'messages/:recipientId', component: MessageComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
