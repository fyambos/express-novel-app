import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private userService: UserService,

  ) {}

  async getStoryById(storyId: string) {
    try {
      const story = await lastValueFrom(this.http.get<any>(`${this.apiUrl}/stories/${storyId}`));
      const author = await this.userService.fetchUser(story.author);
      return { ...story, author };
    } catch (error) {
      console.error('Error fetching story and author:', error);
      throw error;
    }
  }

  async createStory(story: any) {
    try {
      const newStory = await lastValueFrom(this.http.post<any>(`${this.apiUrl}/create`, story));
      return newStory;
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  }

  async editStory(storyId: string, story: any) {
    try {
      const updatedStory = await lastValueFrom(this.http.put<any>(`${this.apiUrl}/stories/${storyId}/edit`, story));
      return updatedStory;
    } catch (error) {
      console.error('Error updating story:', error);
      throw error;
    }
  }

  async getAllStories() {
    try {
      return await lastValueFrom(this.http.get<any[]>(`${this.apiUrl}/stories`));
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  }
}
