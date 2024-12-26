import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true 
  }, 
  username: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  bio: { 
    type: String, 
    default: "This user has not provided a bio yet" 
  },
});

export const User = mongoose.model('User', userSchema);