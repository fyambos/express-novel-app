import mongoose from 'mongoose';

const readSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  storyId: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const Read = mongoose.model('Read', readSchema);
