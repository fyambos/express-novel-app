import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Story } from './models/story.js'; 
import { User } from './models/user.js'; 

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
        console.error(err);
        res.status(500).json({ message: 'Error fetching story' });
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
      console.error(err);
      res.status(500).json({ message: 'Error fetching user' });
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
  
      if (stories.length === 0) {
        return res.status(404).json({ message: 'No stories found for this author' });
      }
  
      res.json(stories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching author stories' });
    }
  });
  

app.listen(port, () => console.log(`Server listening on port ${port}`));