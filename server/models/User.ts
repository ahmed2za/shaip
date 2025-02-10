import mongoose from 'mongoose';
import { hash, compare } from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false,
  },
}, {
  timestamps: true
});

// Add password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await hash(this.password, 12);
  next();
});

// Add method to check password
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return await compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
