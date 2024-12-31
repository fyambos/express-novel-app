import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Message } from '../models/message.model';
import { Conversation } from '../models/conversation.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  async getConversations(currentUserId: string): Promise<Conversation[]> {
    try {
      const response = await lastValueFrom(
        this.http.get<Conversation[]>(`${this.baseUrl}/conversations/${currentUserId}`)
      );
      return response;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  async getMessages(currentUserId: string, recipientId: string): Promise<Message[]> {
    try {
      const response = await lastValueFrom(
        this.http.get<Message[]>(`${this.baseUrl}/messages/${currentUserId}/${recipientId}`)
      );
      return response;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async sendMessage(currentUserId: string, recipientId: string, messageText: string): Promise<Message> {
    const newMessage = {
      senderId: currentUserId,
      recipientId,
      text: messageText,
    };
    try {
      const response = await lastValueFrom(
        this.http.post<Message>(`${this.baseUrl}/messages`, newMessage)
      );
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async markMessagesAsRead(currentUserId: string, recipientId: string): Promise<void> {
    try {
      await lastValueFrom(
        this.http.put<void>(`${this.baseUrl}/messages/mark-read`, { currentUserId, recipientId })
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    try {
      const response: any = await lastValueFrom(
        this.http.get(`${this.baseUrl}/messages/unread-count/${userId}`)
      );
      return response.totalUnreadCount || 0;
    } catch (error) {
      console.error('Error fetching unread message count:', error);
      return 0;
    }
  }

}
