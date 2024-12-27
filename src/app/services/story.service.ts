import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  async getStoryById(storyId: string) {
    try {
      const story = await lastValueFrom(this.http.get<any>(`${this.apiUrl}/stories/${storyId}`));
      return story;
    } catch (error) {
      console.error('Error fetching story:', error);
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

  async fetchUser(userId: string) {
    try {
      return await lastValueFrom(this.http.get<any>(`${this.apiUrl}/users/${userId}`));
    } catch (error) {
      console.error('Error fetching author:', error);
      throw error;
    }
  }
}
