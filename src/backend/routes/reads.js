
import express from 'express';
import { Read } from '../models/read.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { userId, storyId } = req.body;
    
    try {
      const newBookmark = new Read({ userId, storyId });
      await newBookmark.save();
      res.json(newBookmark);
    } catch (error) {
      console.error('Error creating bookmark:', error);
      res.status(500).json({ error: 'Failed to create bookmark' });
    }
  });
  
  router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    
    try {
      const bookmarks = await Read.find({ userId });
      res.json(bookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
  });
  
  router.delete('/:id', async (req, res) => {
    const bookmarkId = req.params.id;
  
    try {
      const result = await Read.findByIdAndDelete(bookmarkId);
      if (!result) {
        return res.status(404).json({ message: 'Bookmark not found' });
      }
      res.status(200).json({ message: 'Bookmark deleted' });
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      res.status(500).json({ error: 'Failed to delete bookmark' });
    }
  });
  
export default router;