import { Injectable } from '@angular/core';
import { Comment } from '../models/comment.model';
import { UserService } from './user.service';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private userService: UserService,
    private http: HttpClient
  ) {}

  async getCommentsByChapterId(chapterId: string) {
    try {
      const comments = await lastValueFrom(this.http.get<any[]>(`${this.apiUrl}/comments/${chapterId}`));
      return this.transformToNested(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async addComment(comment: any) {
    try {
      const response = await lastValueFrom(this.http.post<any>(`${this.apiUrl}/comments`, comment));
      return response;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  async transformToNested(comments: Comment[]): Promise<Comment[]> {
    const commentMap = new Map<number, Comment>();
    comments.forEach(comment => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    const nestedComments: Comment[] = [];

    for (const comment of comments) {
      comment.author = await this.userService.fetchUser(comment.authorId);

      if (comment.replyTo === null) {
        nestedComments.push(comment);
      } else {
        const parent = commentMap.get(comment.replyTo);
        if (parent) {
          parent.replies!.push(comment);
        }
      }
    }

    return nestedComments;
  }

}