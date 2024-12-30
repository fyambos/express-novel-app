import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Story } from './models/story.js'; 
import { User } from './models/user.js'; 
import { Chapter } from './models/chapter.js'; 
import { Comment } from './models/comment.js';
import { Bookmark } from './models/bookmark.js';
import { Read } from './models/read.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/novel-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use(cors());

app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../assets/uploads'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const uploadPath = path.resolve(__dirname, '../assets/uploads');
app.use('/uploads', express.static(uploadPath));

app.post('/api/create', async (req, res) => {
  const { title, summary, tags, rating, author } = req.body;
  try {
    const newStory = new Story({
      title,
      summary,
      rating,
      tags,
      author,
    });
    const savedStory = await newStory.save();
    res.json(savedStory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating story' });
  }
});

app.get('/api/stories/:id', async (req, res) => {
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

app.post('/api/signup', async (req, res) => {
    try {
      const { uid, email } = req.body;
  
      const username = email.split('@')[0];
  
      const newUser = new User({
        id: uid, 
        username, 
        email, 
      });
      console.log(newUser);
  
      await newUser.save();
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating user' });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const stories = await Story.find({ author: userId });
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
  

  app.put('/api/users/:id', async (req, res) => {
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
  
  app.put('/api/stories/:id/edit', async (req, res) => {
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

  app.get('/api/stories', async (req, res) => {
    try {
      const stories = await Story.find();
      res.json(stories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching stories' });
    }
  });

  app.get('/api/author/:id/stories', async (req, res) => {
    try {
      const authorId = req.params.id;
      const stories = await Story.find({ author: authorId });
      res.json(stories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching author stories' });
    }
  });

  app.post('/api/users/:id/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
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

  app.post('/api/chapters', async (req, res) => {
    const { title, content, storyId, authorId } = req.body;
    try {
      const storyExists = await Story.findOne({ _id: storyId });
      if (!storyExists) {
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
      res.json(savedChapter);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating chapter' });
    }
  });
  

app.get('/api/chapters/:id', async (req, res) => {
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

app.put('/api/chapters/:id', async (req, res) => {
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

app.delete('/api/chapters/:id', async (req, res) => {
  const chapterId = req.params.id;

  try {
    const deletedChapter = await Chapter.findByIdAndDelete(chapterId);
    if (!deletedChapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    res.json({ message: 'Chapter deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting chapter' });
  }
});

app.get('/api/stories/:id/chapters', async (req, res) => {
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

app.post('/api/comments', async (req, res) => {
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

app.get('/api/comments/:id', async (req, res) => {
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

app.post('/api/bookmarks', async (req, res) => {
  const { userId, chapterId, storyId } = req.body;
  
  try {
    const newBookmark = new Bookmark({ userId, chapterId, storyId });
    await newBookmark.save();
    res.json(newBookmark);
  } catch (error) {
    console.error('Error creating bookmark:', error);
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
});

app.get('/api/bookmarks/:id', async (req, res) => {
  const userId = req.params.id;
  
  try {
    const bookmarks = await Bookmark.find({ userId });
    res.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

app.delete('/api/bookmarks/:id', async (req, res) => {
  const bookmarkId = req.params.id;

  try {
    const result = await Bookmark.findByIdAndDelete(bookmarkId);
    if (!result) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    res.status(200).json({ message: 'Bookmark deleted' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});


app.post('/api/read', async (req, res) => {
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

app.get('/api/read/:id', async (req, res) => {
  const userId = req.params.id;
  
  try {
    const bookmarks = await Read.find({ userId });
    res.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

app.delete('/api/read/:id', async (req, res) => {
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

app.post('/api/chapters/:id/like', async (req, res) => {
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

app.get('/api/chapters/:id/likes', async (req, res) => {
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

app.get('/api/chapters/:id/like-status', async (req, res) => {
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


app.post('/api/comments/:id/like', async (req, res) => {
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

app.get('/api/comments/:id/likes', async (req, res) => {
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

app.get('/api/comments/:id/like-status', async (req, res) => {
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

app.post('/api/chapters/update-chapter-order', async (req, res) => {
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

app.listen(port, () => console.log(`Server listening on port ${port}`));