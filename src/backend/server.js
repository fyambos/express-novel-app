import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bookmarkRoutes from './routes/bookmarks.js';
import chapterRoutes from './routes/chapters.js';
import commentRoutes from './routes/comments.js';
import conversationRoutes from './routes/conversations.js';
import messageRoutes from './routes/messages.js';
import readRoutes from './routes/reads.js';
import signupRoutes from './routes/signup.js';
import storyRoutes from './routes/stories.js';
import userRoutes from './routes/users.js';

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/novel-app')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use(cors());

app.use(express.json());

app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reads', readRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}`));