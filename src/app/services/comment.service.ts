import { Injectable } from '@angular/core';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  comments: Comment[] = [
    { id: 1, author: 'User1', text: 'This is the first comment.', replyTo: null },
    { id: 2, author: 'User2', text: 'This is a reply to the first comment.', replyTo: 1 },
    { id: 3, author: 'User3', text: 'Another reply to the first comment.', replyTo: 1 },
    { id: 4, author: 'User4', text: 'This is the second comment.', replyTo: null },
    { id: 5, author: 'User5', text: 'This is a reply to the third comment.', replyTo: 3 },
    { id: 7, author: 'User7', text: 'This is a reply to the second comment.', replyTo: 2 },
    { id: 8, author: 'User8', text: 'This is a reply to the seventh comment.', replyTo: 7 },
    { id: 9, author: 'User9', text: 'This is a reply to the eighth comment.', replyTo: 8 },
  ];

  transformToNested(comments: Comment[]): Comment[] {
    const commentMap = new Map<number, Comment>();

    comments.forEach(comment => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    const nestedComments: Comment[] = [];

    comments.forEach(comment => {
      if (comment.replyTo === null) {
        nestedComments.push(comment);
      } else {
        const parent = commentMap.get(comment.replyTo);
        if (parent) {
          parent.replies!.push(comment);
        }
      }
    });

    return nestedComments;
  }
}
