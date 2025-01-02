import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  authorId: {
    type: String,
    required: true
  },
  chapterId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  replyTo: {
    type: String,
    default: null
  },
  likes: {
    type: [String],
    default: []
  },
  deleted: {
    type: Boolean
  },
}, { timestamps: true });

export const Comment = mongoose.model('Comment', commentSchema);
