import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChapterService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  async createChapter(chapter: any): Promise<any> {
    try {
      const response = await lastValueFrom(this.http.post<any>(`${this.baseUrl}/chapters`, chapter));
      return response;
    } catch (error) {
      console.error('Error creating chapter:', error);
      throw error;
    }
  }

  async getChapterById(chapterId: string): Promise<any> {
    try {
      const response = await lastValueFrom(this.http.get<any>(`${this.baseUrl}/chapters/${chapterId}`));
      return response;
    } catch (error) {
      throw error;
    }
  }

  async editChapter(chapterId: string, chapter: any): Promise<any> {
    try {
      const response = await lastValueFrom(this.http.put<any>(`${this.baseUrl}/chapters/${chapterId}`, chapter));
      return response;
    } catch (error) {
      console.error(`Error updating chapter with ID ${chapterId}:`, error);
      throw error;
    }
  }

  async deleteChapter(chapterId: string): Promise<any> {
    try {
      const response = await lastValueFrom(this.http.delete<any>(`${this.baseUrl}/chapters/${chapterId}`));
      return response;
    } catch (error) {
      console.error(`Error deleting chapter with ID ${chapterId}:`, error);
      throw error;
    }
  }

  async getChaptersByStoryId(storyId: string): Promise<any> {
    try {
      const chapters = await lastValueFrom(this.http.get<any>(`${this.baseUrl}/stories/${storyId}/chapters`));
      const sortedChapters = chapters.sort((a: any, b: any) => a.chapter - b.chapter);
      return sortedChapters;
    } catch (error) {
      throw error;
    }
  }

  async toggleLikeChapter(chapterId: string, userId: string): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.http.post<any>(`${this.baseUrl}/chapters/${chapterId}/like`, { userId })
      );
      return response;
    } catch (error) {
      console.error(`Error toggling like for chapter with ID ${chapterId}:`, error);
      throw error;
    }
  }

  async getLikesByChapter(chapterId: string): Promise<number> {
    try {
      const response = await lastValueFrom(this.http.get<any>(`${this.baseUrl}/chapters/${chapterId}/likes`));
      return response.likes;
    } catch (error) {
      console.error(`Error fetching like count for chapter with ID ${chapterId}:`, error);
      throw error;
    }
  }

  async checkIfLiked(chapterId: string, userId: string): Promise<boolean> {
    try {
      const response = await lastValueFrom(
        this.http.get<any>(`${this.baseUrl}/chapters/${chapterId}/like-status`, { params: { userId } })
      );
      return response.isLiked;
    } catch (error) {
      console.error(`Error checking like status for chapter with ID ${chapterId}:`, error);
      throw error;
    }
  }

  async updateChapterOrder(updatedOrder: any) {
    try {
      const response = await lastValueFrom(
        this.http.post(`${this.baseUrl}/chapters/update-chapter-order`, updatedOrder)
      );
      return response;
    } catch (error) {
      console.error('Error updating chapter order:', error);
      throw error;
    }
  }

}
