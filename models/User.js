const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // REQUIRED: Role-based access control 
  role: { 
    type: String, 
    enum: ['visitor', 'member', 'admin'], 
    default: 'member' 
  },
  // FOR PROFILE: Required for the "Member Profile" module 
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  socialLinks: {
    github: String,
    linkedin: String
  },
  techStack: [String], // Tags for skills [cite: 47, 55]
  xp: { type: Number, default: 0 }, // For the leaderboard [cite: 90]
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);