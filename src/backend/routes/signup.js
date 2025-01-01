
import express from 'express';
import { Story } from '../models/story.js'; 
import { User } from '../models/user.js'; 
import { Chapter } from '../models/chapter.js'; 
import { Comment } from '../models/comment.js';
import { Bookmark } from '../models/bookmark.js';
import { Read } from '../models/read.js';
import { Message } from '../models/message.js';
import { Notification } from '../models/notification.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();


  router.post('/', async (req, res) => {
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

export default router;