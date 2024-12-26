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
  const { title, summary, rating, author } = req.body;
  const tags = req.body.tags.split(", ")
  try {
    const newStory = new Story({
      title,
      summary,
      rating,
      tags,
      author: author,
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
  
      await newUser.save();
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating user' });
    }
  });

app.listen(port, () => console.log(`Server listening on port ${port}`));