import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  genres: {
    type: [String],
  },
  rating: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: [String],
    required: true,
  },
});

export const Story = mongoose.model('Story', storySchema);