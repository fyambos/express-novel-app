
import express from 'express';
import { Comment } from '../models/comment.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
      const { authorId, chapterId, text, replyTo } = req.body;
      const newComment = new Comment({
        authorId,
        chapterId,
        text,
        replyTo: replyTo || null,
      });
      await newComment.save();
      res.json(newComment);
    } catch (err) {
      res.status(500).json({ message: 'Error adding comment', error: err });
    }
  });
  
  router.get('/:id', async (req, res) => {
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
  
export default router;