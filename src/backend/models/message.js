import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true
  },
  recipientId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  },
  participants: {
    type: [String],
    required: true
  }
}, { timestamps: true });

export const Message = mongoose.model('Message', messageSchema);
