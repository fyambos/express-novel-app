
import express from 'express';
import { Message } from '../models/message.js';

const router = express.Router();

router.get('/unread-count/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const unreadMessages = await Message.find({ recipientId: userId, read: false });
      const totalUnreadCount = unreadMessages.length;
      res.status(200).json({ totalUnreadCount, message: 'Unread message count fetched successfully' });
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      res.status(500).json({ message: 'Failed to fetch unread message count' });
    }
  });
  
  router.get('/:currentUserId/:recipientId', async (req, res) => {
    try {
      const { currentUserId, recipientId } = req.params;
      const messages = await Message.find({
        participants: { $all: [currentUserId, recipientId] },
      }).sort({ timestamp: 1 });
  
      res.json(messages);
    } catch (error) {
      res.status(500).send('Error fetching messages');
    }
  });
  
  router.post('/', async (req, res) => {
    try {
      const { senderId, recipientId, text } = req.body;
      const newMessage = new Message({
        senderId,
        recipientId,
        text,
        timestamp: new Date().toISOString(),
        read: false,
        participants: [senderId, recipientId],
      });
  
      await newMessage.save();
      res.json(newMessage);
    } catch (error) {
      res.status(500).send('Error sending message');
    }
  });
  
  router.put('/mark-read', async (req, res) => {
    try {
      const { currentUserId, recipientId } = req.body;
      await Message.updateMany(
        {
          participants: { $all: [currentUserId, recipientId] },
          recipientId: currentUserId,
          read: false,
        },
        { $set: { read: true } }
      );
      res.json({ message: 'Messages marked as read' });
    } catch (error) {
      res.status(500).send('Error marking messages as read');
    }
  });
  
export default router;