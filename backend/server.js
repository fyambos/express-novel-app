import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Story } from './models/story.js'; 

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

app.post('/api/stories', async (req, res) => {
  const { title, summary, genres, rating, tags } = req.body;
  try {
    const newStory = new Story({
      title,
      summary,
      genres,
      rating,
      tags,
    });
    const savedStory = await newStory.save();
    res.json(savedStory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating story' });
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));