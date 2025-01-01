
import express from 'express';
import { Notification } from '../models/notification.js';

const router = express.Router();
  router.get('/unread-count/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const unreadNotifications = await Notification.find({ userId: userId, isRead: false });
      const totalUnreadCount = unreadNotifications.length;
      res.status(200).json({ totalUnreadCount, message: 'Unread notification count fetched successfully' });
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      res.status(500).json({ message: 'Failed to fetch unread notification count' });
    }
  });

  router.get('/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
      res.json(notifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      res.status(500).json({ message: 'Error fetching notifications' });
    }
  });
  
  router.post('/:id/mark-read', async (req, res) => {
    const userId = req.params.id;
  
    try {
      await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true } });
      res.json({ message: 'Notifications marked as read' });
    } catch (err) {
      console.error('Error marking notifications as read:', err);
      res.status(500).json({ message: 'Error marking notifications as read' });
    }
  });

export default router;