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
  story: { 
    type: String,
    required: true
}, 
  author: { 
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
}
});

const Chapter = mongoose.model('Chapter', chapterSchema);

export { Chapter };
