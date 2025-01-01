import mongoose from 'mongoose';
import { type } from 'os';

const userSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true 
  }, 
  username: { 
    type: String, 
    required: true,
    unique: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true
  },
  bio: { 
    type: String, 
    default: "This user has not provided a bio yet." 
  },
  theme: { 
    type: String, 
    default: "dark" 
  },
  interests: { 
    type: [String], 
    default: [] 
  },
  profilePicture: {
    type: String,
    default: ''
  },
  followings: {
    type: [String],
    default: []
  },
  followers: {
    type: [String],
    default: []
  }
});

export const User = mongoose.model('User', userSchema);