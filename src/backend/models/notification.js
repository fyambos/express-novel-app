import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  }, // The user being notified
  actorId: {
    type: String,
    required: true
  }, // The user who triggered the notification
  type: {
    type: String,
    enum: ['follow'],
    required: true
  }, // Notification type (e.g., 'follow')
  isRead: {
    type: Boolean,
    default: false
  }, // For marking notifications as read
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
