import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  actorId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['follow','story','comment','reply','comment-like','chapter-like','subscribe'],
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  objectId: {
    type: String,
  },
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
