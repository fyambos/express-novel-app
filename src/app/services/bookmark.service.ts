import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

   private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  async createBookmark(userId: string, chapterId: string | null, storyId: string, actionType: 'bookmark' | 'read'): Promise<any> {
    try {
      const endpoint = actionType === 'bookmark' ? '/bookmarks' : '/read';
      const response = await lastValueFrom(this.http.post(`${this.apiUrl}${endpoint}`, { userId, chapterId, storyId }));
      return response;
    } catch (error) {
      console.error(`Error ${actionType === 'bookmark' ? 'creating bookmark' : 'marking story as read'}:`, error);
      throw new Error(`Failed to ${actionType === 'bookmark' ? 'create bookmark' : 'mark story as read'}`);
    }
  }
  
  async getBookmarksByUserId(userId: string, actionType: 'bookmark' | 'read'): Promise<any[]> {
    try {
      const endpoint = actionType === 'bookmark' ? `/bookmarks/${userId}` : `/read/${userId}`;
      const response = await lastValueFrom(this.http.get<any[]>(`${this.apiUrl}${endpoint}`));
      return response;
    } catch (error) {
      console.error(`Error fetching ${actionType === 'bookmark' ? 'bookmarks' : 'read stories'}:`, error);
      throw new Error(`Failed to fetch ${actionType === 'bookmark' ? 'bookmarks' : 'read stories'}`);
    }
  }
  
  async deleteBookmark(id: string, actionType: 'bookmark' | 'read'): Promise<void> {
    try {
      const endpoint = actionType === 'bookmark' ? `/bookmarks/${id}` : `/read/${id}`;
      await lastValueFrom(this.http.delete(`${this.apiUrl}${endpoint}`));
    } catch (error) {
      console.error(`Error deleting ${actionType === 'bookmark' ? 'bookmark' : 'read status'}:`, error);
      throw new Error(`Failed to delete ${actionType === 'bookmark' ? 'bookmark' : 'read status'}`);
    }
  }
  

}
