
import express from 'express';
import { Story } from '../models/story.js'; 
import { Chapter } from '../models/chapter.js';
import { User } from '../models/user.js';
import { Notification } from '../models/notification.js';

const router = express.Router();

  router.get('/:id', async (req, res) => {
    try {
        const storyId = req.params.id;
        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        res.json(story);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(404).json({ message: 'Story not found' });
        } else {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching story' });
        }
    }
  });

  router.post('/', async (req, res) => {
    const { title, summary, tags, rating, authorId } = req.body;
    try {
      const newStory = new Story({
        title,
        summary,
        rating,
        tags,
        authorId,
      });
      const savedStory = await newStory.save();
      const author = await User.findOne({ id: authorId });
      if (!author) {
        return res.status(404).json({ message: 'Author not found' });
      }
      for (const followerId of author.followers) {
        await Notification.create({
          userId: followerId,
          actorId: authorId,
          type: 'story',
          objectId: savedStory._id,
        });
      }
      res.json(savedStory);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating story' });
    }
  });

  router.put('/:id/edit', async (req, res) => {
    const storyId = req.params.id;
    const { title, summary, rating, tags } = req.body;
  
    try {
      const updatedStory = await Story.findOneAndUpdate(
        { _id: storyId },
        { title, summary, rating, tags },
        { new: true }
      );
  
      if (!updatedStory) {
        return res.status(404).json({ message: 'Story not found' });
      }
  
      res.json(updatedStory);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating story' });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const stories = await Story.find();
      res.json(stories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching stories' });
    }
  });

  router.get('/:id/chapters', async (req, res) => {
    const storyId = req.params.id;
    try {
      const story = await Story.findById(storyId);
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }
      const chapters = await Chapter.find({ storyId: storyId });
      res.json(chapters);
    } catch (err) {
      if (err.name === 'CastError') {
          return res.status(404).json({ message: 'Story not found' });
      } else {
          console.error(err);
          return res.status(500).json({ message: 'Error fetching story or chapters' });
      }
    }
  });

  router.delete('/:id', async (req, res) => {
    const storyId = req.params.id;
  
    try {
      const story = await Story.findById(storyId);
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }
      await Story.findByIdAndDelete(storyId);
      await Chapter.deleteMany({ storyId });
  
      res.status(200).json({ message: 'Story and associated chapters deleted successfully' });
    } catch (err) {
      console.error('Error deleting story and chapters:', err);
      res.status(500).json({ message: 'Error deleting story and associated chapters' });
    }
  });

  router.post('/:id/subscribe', async (req, res) => {
    const storyId = req.params.id;
    const { currentUserId } = req.body;
  
    try {
      const story = await Story.findById(storyId);
      if (!story) {
        return res.status(404).json({ message: 'Story to subscribe not found' });
      }
  
      const userIndex = story.subscribers.indexOf(currentUserId);
  
      if (userIndex === -1) {
        story.subscribers.push(currentUserId);
        const notificationExists = await Notification.findOne({
          userId: story.authorId,
          actorId: currentUserId,
          type: 'subscribe',
          objectId: storyId,
        });
  
        if (!notificationExists) {
          await Notification.create({
            userId: story.authorId,
            actorId: currentUserId,
            type: 'subscribe',
            objectId: storyId,
          });
        }
      } else {
        story.subscribers.splice(userIndex, 1);
      }
  
      await story.save();
      res.json({ message: 'Story subscribers status updated', subscribers: story.subscribers });
    } catch (err) {
      console.error('Error updating story subscribers status:', err);
      res.status(500).json({ message: 'Error updating story subscribers status' });
    }
  });

  router.get('/:id/subscribe-status', async (req, res) => {
    const storyId = req.params.id;
    const currentUserId = req.query.currentUserId;
  
    try {
      const story = await Story.findById(storyId);
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }
      const isFollowing = story.subscribers.includes(currentUserId);
      res.json({ isFollowing });
    } catch (err) {
      console.error('Error checking subscribe status:', err);
      res.status(500).json({ message: 'Error checking subscribe status' });
    }
  });
export default router;