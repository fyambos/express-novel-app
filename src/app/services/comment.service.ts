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
      const comments = await lastValueFrom(this.http.get<any[]>(`${this.apiUrl}/comments/chapters/${chapterId}`));
      const nestedComments = await this.transformToNested(comments);
      return nestedComments;
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
    const commentMap = new Map<string, Comment>();
    comments.forEach(comment => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    const nestedComments: Comment[] = [];

    for (const comment of comments) {
      try {
        if (!comment.deleted) {
          comment.author = await this.userService.fetchUser(comment.authorId);
        }
      } catch (error) {
        console.error(`Failed to fetch author for comment ${comment.id}:`, error);
      }

      if (comment.replyTo === null) {
        nestedComments.push(comment);
      } else {
        const parent = commentMap.get(comment.replyTo);
        if (parent) {
          parent.replies!.push(comment);
        } else {
          console.warn(`Comment with ID ${comment.id} has an orphaned parent`)
        }
      }
    }

    return nestedComments;
  }

  async toggleLikeComment(commentId: string, userId: string): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.http.post<any>(`${this.apiUrl}/comments/${commentId}/like`, { userId })
      );
      return response;
    } catch (error) {
      console.error(`Error toggling like for chapter with ID ${commentId}:`, error);
      throw error;
    }
  }

  async getLikesByComment(commentId: string): Promise<number> {
    try {
      const response = await lastValueFrom(this.http.get<any>(`${this.apiUrl}/comments/${commentId}/likes`));
      return response.likes;
    } catch (error) {
      console.error(`Error fetching like count for comment with ID ${commentId}:`, error);
      throw error;
    }
  }

  async checkIfLiked(commentId: string, userId: string): Promise<boolean> {
    try {
      const response = await lastValueFrom(
        this.http.get<any>(`${this.apiUrl}/comments/${commentId}/like-status`, { params: { userId } })
      );
      return response.isLiked;
    } catch (error) {
      console.error(`Error checking like status for comment with ID ${commentId}:`, error);
      throw error;
    }
  }

  async getCommentById(commentId: string) {
    try {
      const comment = await lastValueFrom(this.http.get<any>(`${this.apiUrl}/comments/${commentId}`));
      const chapterComments = await this.getCommentsByChapterId(comment.chapterId);
      const findCommentById = (comments: any[], id: string): any | null => {
        for (const comment of comments) {
          if (comment.id === id) {
            return comment;
          }
          const foundInReplies = findCommentById(comment.replies, id);
          if (foundInReplies) {
            return foundInReplies;
          }
        }
        return null;
      };
      
      const targetComment = findCommentById(chapterComments, commentId);
      if (!targetComment) {
        throw new Error(`Comment with ID ${commentId} not found`);
      }
      return [targetComment];
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async deleteComment(commentId: string): Promise<Comment> {
    try {
      const response = await lastValueFrom(
        this.http.patch<any>(`${this.apiUrl}/comments/${commentId}/delete`, {})
      );
      return response.comment;
    } catch (error) {
      console.error(`Error deleting comment with ID ${commentId}:`, error);
      throw error;
    }
  }

}
