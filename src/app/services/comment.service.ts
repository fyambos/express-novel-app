import { Injectable } from '@angular/core';
import { Comment } from '../models/comment.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

    constructor(
      private userService: UserService,
    ) {}
  
  comments: Comment[] = [
    { id: 1, authorId: 'JcMZt9kkGYcJUroyFhC68Lah6k83', chapterId: '67704455662a3261b4346c6b', text: 'This is the first comment.', replyTo: null },
    { id: 2, authorId: 'JcMZt9kkGYcJUroyFhC68Lah6k83', chapterId: '67704455662a3261b4346c6b', text: 'This is a reply to the first comment.', replyTo: 1 },
    { id: 3, authorId: 'JcMZt9kkGYcJUroyFhC68Lah6k83', chapterId: '67704455662a3261b4346c6b', text: 'Another reply to the first comment.', replyTo: 1 },
    { id: 4, authorId: 'JcMZt9kkGYcJUroyFhC68Lah6k83', chapterId: '67704455662a3261b4346c6b', text: 'This is the second comment.', replyTo: null },
    { id: 5, authorId: 'JcMZt9kkGYcJUroyFhC68Lah6k83', chapterId: '67704455662a3261b4346c6b', text: 'This is a reply to the third comment.', replyTo: 3 },
    { id: 7, authorId: 'JcMZt9kkGYcJUroyFhC68Lah6k83', chapterId: '67704455662a3261b4346c6b', text: 'This is a reply to the second comment.', replyTo: 2 },
    { id: 8, authorId: 'JcMZt9kkGYcJUroyFhC68Lah6k83', chapterId: '67704455662a3261b4346c6b', text: 'This is a reply to the seventh comment.', replyTo: 7 },
    { id: 9, authorId: 'JcMZt9kkGYcJUroyFhC68Lah6k83', chapterId: '67704455662a3261b4346c6b', text: 'This is a reply to the eighth comment.', replyTo: 8 },
  ];

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
