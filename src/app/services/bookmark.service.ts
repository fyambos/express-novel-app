import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

   private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  async createBookmark(userId: string, chapterId: string, storyId: string): Promise<any> {
    try {
      const response = await lastValueFrom(this.http.post(`${this.apiUrl}/bookmarks`, { userId, chapterId, storyId }));
      return response;
    } catch (error) {
      console.error('Error creating bookmark:', error);
      throw new Error('Failed to create bookmark');
    }
  }

  async markAsRead(userId: string, storyId: string): Promise<any> {
    try {
      const response = await lastValueFrom(this.http.post(`${this.apiUrl}/read`, { userId, storyId }));
      return response;
    } catch (error) {
      console.error('Error marking story as read:', error);
      throw new Error('Failed to mark story as read');
    }
  }

  async getBookmarksByUserId(userId: string): Promise<any[]> {
    try {
      const response = await lastValueFrom(this.http.get<any[]>(`${this.apiUrl}/bookmarks/${userId}`));
      return response;
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw new Error('Failed to fetch bookmarks');
    }
  }

  async getReadStoriesByUser(userId: string): Promise<any[]> {
    try {
      const response = await lastValueFrom(this.http.get<any[]>(`${this.apiUrl}/read/${userId}`));
      return response;
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw new Error('Failed to fetch bookmarks');
    }
  }

  async deleteBookmarkById(id: string): Promise<void> {
    try {
      await lastValueFrom(this.http.delete(`${this.apiUrl}/bookmarks/${id}`));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      throw new Error('Failed to delete bookmark');
    }
  }

  async unmarkAsRead(id: string): Promise<void> {
    try {
      await lastValueFrom(this.http.delete(`${this.apiUrl}/read/${id}`));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      throw new Error('Failed to delete bookmark');
    }
  }
  
}
