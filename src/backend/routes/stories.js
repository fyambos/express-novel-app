
import express from 'express';
import { Story } from '../models/story.js'; 
import { Chapter } from '../models/chapter.js';

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
  
export default router;