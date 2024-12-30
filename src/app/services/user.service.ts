import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  async fetchUser(userId: string) {
    try {
      return await lastValueFrom(this.http.get<any>(`${this.apiUrl}/users/${userId}`));
    } catch (error) {
      throw error;
    }
  }

  async saveUserToDB(userData: { uid: string; email: string }) {
    try {
      return await lastValueFrom(this.http.post(`${this.apiUrl}/signup`, userData));
    } catch (error) {
      console.error('Error saving user to database:', error);
      throw error;
    }
  }

  async saveUserTheme(userId: string, theme: string) {
    try {
      const response = await lastValueFrom(
        this.http.put(`${this.apiUrl}/users/${userId}`, { theme })
      );
      return response;
    } catch (error) {
      console.error('Error saving user theme:', error);
      throw error;
    }
  }

  async updateUser(userId: string, username: string, bio: string, interests: string) {
    try {
      const response = await lastValueFrom(
        this.http.put(`${this.apiUrl}/users/${userId}`, { username, bio, interests })
      );
      return response;
    } catch (error) {
      console.error('Error saving user theme:', error);
      throw error;
    }
  }

  async fetchAuthorStories(authorId: string) {
    try {
      const stories = await lastValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/author/${authorId}/stories`)
      );
      const storiesWithAuthors = await Promise.all(
        stories.map(async (story) => {
          const author = await this.fetchUser(authorId);
          return { ...story, author };
        })
      );
      return storiesWithAuthors;
    } catch (error) {
      console.error('Error fetching author stories:', error);
      throw error;
    }
  }
  
  async uploadProfilePicture(userId: string, formData: FormData) {
    try {
      return await lastValueFrom(
        this.http.post<any>(`${this.apiUrl}/users/${userId}/upload-profile-picture`, formData)
      );
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }
}
