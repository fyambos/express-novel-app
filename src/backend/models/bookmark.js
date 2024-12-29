import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  chapterId: {
    type: String,
    required: true
  },
  storyId: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
