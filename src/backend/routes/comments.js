
import express from 'express';
import { Comment } from '../models/comment.js';
import { Chapter } from '../models/chapter.js';
import { Notification } from '../models/notification.js';
import { User } from '../models/user.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
      const { authorId, chapterId, text, replyTo } = req.body;
      const chapterAuthor = await Chapter.findById(chapterId);
      const replyToAuthor = await Comment.findById(replyTo);
      const newComment = new Comment({
        authorId,
        chapterId,
        text,
        replyTo: replyTo || null,
      });
      if (authorId !== chapterAuthor.authorId) {
        await Notification.create({
          userId: chapterAuthor.authorId,
          actorId: authorId,
          type: 'comment',
          objectId: newComment._id.toString(),
        });
      }
      if (replyTo && authorId !== replyToAuthor.authorId) {
        await Notification.create({
          userId: replyToAuthor.authorId,
          actorId: authorId,
          type: 'reply',
          objectId: replyTo,
        });
      }

      await newComment.save();
      res.json(newComment);
    } catch (err) {
      console.error('Error adding comment:', err);
      res.status(500).json({ message: 'Error adding comment', error: err });
    }
  });
  
  router.get('/chapters/:id', async (req, res) => {
    try {
      const chapterId = req.params.id;
      const comments = await Comment.find({ chapterId })
        .sort({ createdAt: 1 })
        .lean();
      const commentsWithId = comments.map(comment => {
        return {
          ...comment,
          id: comment._id.toString(),
        };
      });
      res.json(commentsWithId);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching comments', error: err });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const commentId = req.params.id;
      const comment = await Comment.findById(commentId).lean();
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      const commentWithId = { ...comment, id: comment._id.toString() };
      res.json(commentWithId);
    } catch (err) {
      if (err.name === 'CastError') {
          return res.status(404).json({ message: 'Comment not found' });
      } else {
          console.error(err);
          return res.status(500).json({ message: 'Error fetching comment' });
      }
    }
  });
  
  router.post('/:id/like', async (req, res) => {
    const commentId = req.params.id;
    const { userId } = req.body;
  
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      const userIndex = comment.likes.indexOf(userId);
  
      if (userIndex === -1) {
        comment.likes.push(userId);
        const notificationExists = await Notification.findOne({
          userId: comment.authorId,
          actorId: userId,
          type: 'comment-like',
          objectId: commentId,
        });
        if (!notificationExists && userId !== comment.authorId) {
          await Notification.create({
            userId: comment.authorId,
            actorId: userId,
            type: 'comment-like',
            objectId: commentId,
          });
        }
      } else {
        comment.likes.splice(userIndex, 1);
      }
  
      await comment.save();
      res.json({ message: 'Comment like status updated', likes: comment.likes });
    } catch (err) {
      console.error('Error updating like status:', err);
      res.status(500).json({ message: 'Error updating like status' });
    }
  });
  
  router.get('/:id/likes', async (req, res) => {
    const commentId = req.params.id;
  
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      res.json({ likes: comment.likes });
    } catch (err) {
      console.error('Error fetching like count:', err);
      res.status(500).json({ message: 'Error fetching like count' });
    }
  });
  
  router.get('/:id/like-status', async (req, res) => {
    const commentId = req.params.id;
    const userId = req.query.userId;
  
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      const isLiked = comment.likes.includes(userId);
      res.json({ isLiked });
    } catch (err) {
      console.error('Error checking like status:', err);
      res.status(500).json({ message: 'Error checking like status' });
    }
  });

  router.patch('/:id/delete', async (req, res) => {
    const commentId = req.params.id;
  
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      comment.deleted = true;
      comment.authorId = "Unknown";
      comment.text = "This comment has been deleted";
      await comment.save();
      res.json({ message: 'Comment marked as deleted', comment });
    } catch (err) {
      console.error('Error deleting comment:', err);
      res.status(500).json({ message: 'Error deleting comment', error: err });
    }
  });
  
export default router;