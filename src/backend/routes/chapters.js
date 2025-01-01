
import express from 'express';
import { Story } from '../models/story.js'; 
import { User } from '../models/user.js'; 
import { Chapter } from '../models/chapter.js'; 
import { Comment } from '../models/comment.js';
import { Notification } from '../models/notification.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { title, content, storyId, authorId } = req.body;
    try {
      const story = await Story.findOne({ _id: storyId });
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }
      const authorExists = await User.findOne({ id: authorId });
      if (!authorExists) {
        return res.status(404).json({ message: 'Author not found' });
      }
      const latestChapter = await Chapter.findOne({ storyId }).sort({ chapter: -1 }).limit(1);
      let chapterNumber = 1;
      if (latestChapter) {
        chapterNumber = latestChapter.chapter + 1;
      }
      const newChapter = new Chapter({
        title,
        content,
        storyId,
        authorId,
        chapter: chapterNumber,
      });
      const savedChapter = await newChapter.save();
      for (const subscriberId of story.subscribers) {
        await Notification.create({
          userId: subscriberId,
          actorId: authorId,
          type: 'chapter',
          objectId: savedChapter._id,
        });
      }
      res.json(savedChapter);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating chapter' });
    }
  });
  

router.get('/:id', async (req, res) => {
  try {
    const chapterId = req.params.id;
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    const story = await Story.findOne({ _id: chapter.storyId });
    const author = await User.findOne({ id: chapter.authorId });
    const chapterWithDetails = {
      ...chapter.toObject(),
      story: story ? story : null,
      author: author ? author : null,
    };
    res.json(chapterWithDetails);
  } catch (err) {
    if (err.name === 'CastError') {
        return res.status(404).json({ message: 'Chapter not found' });
    } else {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching chapter' });
    }
  }
});

router.put('/:id', async (req, res) => {
  const chapterId = req.params.id;
  const { title, content, storyId, authorId } = req.body;

  try {
    const updatedChapter = await Chapter.findByIdAndUpdate(
      chapterId,
      { title, content, storyId, authorId, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedChapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.json(updatedChapter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating chapter' });
  }
});

router.delete('/:id', async (req, res) => {
  const chapterId = req.params.id;

  try {
    const chapterToDelete = await Chapter.findById(chapterId);
    if (!chapterToDelete) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    await Chapter.findByIdAndDelete(chapterId);
    const chapters = await Chapter.find({ storyId: chapterToDelete.storyId }).sort({ chapter: 1 });
    for (let i = 0; i < chapters.length; i++) {
      chapters[i].chapter = i + 1; //reorder chapters after deleting one
      await chapters[i].save();
    }
    res.status(200).json({ message: 'Chapter deleted and reordered successfully!' });
  } catch (error) {
    console.error('Error deleting and reordering chapters:', error);
    res.status(500).json({ message: 'An error occurred while deleting and reordering the chapters.' });
  }
});

router.post('/:id/like', async (req, res) => {
    const chapterId = req.params.id;
    const { userId } = req.body;
  
    try {
      const chapter = await Chapter.findById(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
  
      const userIndex = chapter.likes.indexOf(userId);
  
      if (userIndex === -1) {
        chapter.likes.push(userId);
        const notificationExists = await Notification.findOne({
          userId: chapter.authorId,
          actorId: userId,
          type: 'chapter-like',
          objectId: chapterId,
        });
        if (!notificationExists && userId !== chapter.authorId) {
          await Notification.create({
            userId: chapter.authorId,
            actorId: userId,
            type: 'chapter-like',
            objectId: chapterId,
          });
        }
      } else {
        chapter.likes.splice(userIndex, 1);
      }
  
      await chapter.save();
      res.json({ message: 'Chapter like status updated', likes: chapter.likes });
    } catch (err) {
      console.error('Error updating like status:', err);
      res.status(500).json({ message: 'Error updating like status' });
    }
  });
  
  router.get('/:id/likes', async (req, res) => {
    const chapterId = req.params.id;
  
    try {
      const chapter = await Chapter.findById(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      res.json({ likes: chapter.likes });
    } catch (err) {
      console.error('Error fetching like count:', err);
      res.status(500).json({ message: 'Error fetching like count' });
    }
  });
  
  router.get('/:id/like-status', async (req, res) => {
    const chapterId = req.params.id;
    const userId = req.query.userId;
  
    try {
      const chapter = await Chapter.findById(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      const isLiked = chapter.likes.includes(userId);
      res.json({ isLiked });
    } catch (err) {
      console.error('Error checking like status:', err);
      res.status(500).json({ message: 'Error checking like status' });
    }
  });


  router.post('/update-chapter-order', async (req, res) => {
    const updatedOrder = req.body;
    try {
      for (let i = 0; i < updatedOrder.length; i++) {
        const { chapterId, order } = updatedOrder[i];
        await Chapter.findByIdAndUpdate(chapterId, { chapter: order });
      }
      res.status(200).json({ message: 'Chapter order updated successfully!' });
    } catch (error) {
      console.error('Error updating chapter order:', error);
      res.status(500).json({ message: 'An error occurred while updating the chapter order.' });
    }
  });
  
    
export default router;