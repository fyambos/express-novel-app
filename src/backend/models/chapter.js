import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true 
},
  content: { 
    type: String,
    required: true 
},
  storyId: { 
    type: String,
    required: true
}, 
  authorId: { 
    type: String,
    required: true
},
  createdAt: {
    type: Date,
    default: Date.now
},
  updatedAt: { 
    type: Date,
    default: Date.now
},
  chapter: {
    type: Number,
    required: true
},
  likes: {
    type: [String],
    default: []
  }
});

const Chapter = mongoose.model('Chapter', chapterSchema);

export { Chapter };
