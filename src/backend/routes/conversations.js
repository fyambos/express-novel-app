
import express from 'express';
import { User } from '../models/user.js'; 
import { Message } from '../models/message.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const messages = await Message.find({ participants: userId }).sort({ timestamp: -1 });
      const conversationsMap = new Map();
  
      for (const msg of messages) {
        const otherUserId = msg.senderId === userId ? msg.recipientId : msg.senderId;
  
        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            recipientId: otherUserId,
            lastMessage: msg.text,
            lastMessageTimestamp: msg.timestamp,
            unreadCount: msg.read === false && msg.recipientId === userId ? 1 : 0,
          });
        } else {
          const conversation = conversationsMap.get(otherUserId);
          conversation.unreadCount += msg.read === false && msg.recipientId === userId ? 1 : 0;
          if (new Date(conversation.lastMessageTimestamp) < new Date(msg.timestamp)) {
            conversation.lastMessage = msg.text;
            conversation.lastMessageTimestamp = msg.timestamp;
          }
        }
      }
      const conversations = await Promise.all(
        Array.from(conversationsMap.values()).map(async (conversation) => {
          const recipient = await User.findOne({ id: conversation.recipientId });
          if (recipient) {
            conversation.username = recipient.username;
            conversation.profilePicture = recipient.profilePicture;
          }
          return conversation;
        })
      );
      res.json(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).send('Error fetching conversations');
    }
  });
  
export default router;