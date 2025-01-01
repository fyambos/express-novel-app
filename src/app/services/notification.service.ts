import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  async getNotifications(userId: string) {
    try {
      return await lastValueFrom(this.http.get(`${this.baseUrl}/notifications/${userId}`));
    } catch (err) {
      console.error('Error fetching notifications:', err);
      throw err;
    }
  }

  async markNotificationsAsRead(userId: string) {
    try {
      return await lastValueFrom(
        this.http.post(`${this.baseUrl}/notifications/${userId}/mark-read`, {})
      );
    } catch (err) {
      console.error('Error marking notifications as read:', err);
      throw err;
    }
  }
}
