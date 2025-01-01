
import express from 'express';
import { Story } from '../models/story.js'; 
import { User } from '../models/user.js'; 
import { Chapter } from '../models/chapter.js'; 
import { Comment } from '../models/comment.js';
import { Bookmark } from '../models/bookmark.js';
import { Read } from '../models/read.js';
import { Notification } from '../models/notification.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../assets/uploads'); 
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
const upload = multer({ storage });

router.post('/:id/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
    const userId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.profilePicture!="") {
        const oldFilePath = path.join('..', '/assets', user.profilePicture);
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error('Error deleting old profile picture:', err);
          }
        });
      }
      const updatedUser = await User.findOneAndUpdate(
        { id: userId },
        { profilePicture: `/uploads/${req.file.filename}` },
        { new: true }
      );
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error uploading profile picture' });
    }
  });


  router.get('/exists/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findOne({ id: userId });
      if (user) {
        return res.status(200).json({ exists: true });
      } else {
        return res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking if user exists:', error);
      res.status(500).json({ message: 'Failed to check user existence' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const stories = await Story.find({ authorId: userId });
      const userObj = user.toObject();
      if (stories.length > 0) {
        userObj.role = 'Writer';
      } else {
        userObj.role = 'Reader';
      }
      res.json(userObj);
    } catch (err) {
      if (err.name === 'CastError') {
          return res.status(404).json({ message: 'User not found' });
      } else {
          console.error(err);
          return res.status(500).json({ message: 'Error fetching user' });
      }
    }
  });
  

  router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { username, bio, theme, interests } = req.body;
    
    try {
      const updatedUser = await User.findOneAndUpdate(
        { id: userId },
        { username, bio, theme, interests },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating user information' });
    }
  });

  router.get('/:id/stories', async (req, res) => {
    try {
      const authorId = req.params.id;
      const stories = await Story.find({ authorId: authorId });
      res.json(stories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching author stories' });
    }
  });

  router.delete('/:id', async (req, res) => {
    const userId = req.params.id;
    const replacementAuthorId = "svc3NgV4S3PSGgtXY0YH0ZFplZ93";
  
    try {
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.profilePicture!="") {
        const oldFilePath = path.join('..', '/assets', user.profilePicture);
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error('Error deleting old profile picture:', err);
          }
        });
      }
      await Story.updateMany(
        { authorId: userId },
        { $set: { authorId: replacementAuthorId } }
      );
      await Chapter.updateMany(
        { authorId: userId },
        { $set: { authorId: replacementAuthorId } }
      );
      await Comment.updateMany(
        { authorId: userId },
        { $set: { authorId: replacementAuthorId } }
      );
      await Bookmark.deleteMany({ userId });
      await Read.deleteMany({ userId });
      await Notification.deleteMany({
        $or: [
          { userId: userId },
          { actorId: userId }
        ]
      });
      await User.updateMany(
        { $or: [{ followers: userId }, { followings: userId }] },
        {
          $pull: { followers: userId, followings: userId },
        }
      );
      await Chapter.updateMany(
        { likes: userId },
        { $pull: { likes: userId } }
      );
      await Comment.updateMany(
        { likes: userId },
        { $pull: { likes: userId } }
      );
      await User.deleteOne({ id: userId });
  
      res.status(200).json({ message: 'User and related data processed successfully' });
    } catch (err) {
      console.error('Error deleting user and processing related data:', err);
      res.status(500).json({ message: 'Error deleting user and processing related data' });
    }
  });

  router.post('/:id/follow', async (req, res) => {
    const userId = req.params.id;
    const { currentUserId } = req.body;
  
    try {
      const userToFollow = await User.findOne({ id: userId });
      if (!userToFollow) {
        return res.status(404).json({ message: 'User to follow not found' });
      }
  
      const userIndex = userToFollow.followers.indexOf(currentUserId);
  
      if (userIndex === -1) {
        userToFollow.followers.push(currentUserId);
        const notificationExists = await Notification.findOne({
          userId: userId,
          actorId: currentUserId,
          type: 'follow',
        });
        if (!notificationExists) {
          await Notification.create({
            userId: userId,
            actorId: currentUserId,
            type: 'follow',
          });
        }
      } else {
        userToFollow.followers.splice(userIndex, 1);
      }
  
      await userToFollow.save();
      res.json({ message: 'Followers status updated', followers: userToFollow.followers });
    } catch (err) {
      console.error('Error updating followers status:', err);
      res.status(500).json({ message: 'Error updating followers status' });
    }
  });

  router.get('/:id/follow-status', async (req, res) => {
    const userId = req.params.id;
    const currentUserId = req.query.currentUserId;
  
    try {
      const user = await User.findOne({id: userId});
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const isFollowing = user.followers.includes(currentUserId);
      res.json({ isFollowing });
    } catch (err) {
      console.error('Error checking follow status:', err);
      res.status(500).json({ message: 'Error checking follow status' });
    }
  });
  
export default router;