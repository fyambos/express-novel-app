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
      console.error('Error fetching author:', error);
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
}
