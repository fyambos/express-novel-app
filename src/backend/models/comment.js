const mongoose = require('mongoose');

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
    type: Number,
    default: null
  }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
