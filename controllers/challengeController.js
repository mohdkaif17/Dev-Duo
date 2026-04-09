const Challenge = require('../models/Challenge');

// Get all challenges (with optional difficulty filter)
exports.getChallenges = async (req, res) => {
  try {
    const { difficulty } = req.query;
    let query = {};
    
    if (difficulty) query.difficulty = difficulty;
    
    const challenges = await Challenge.find(query)
      .populate('submittedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create challenge
exports.createChallenge = async (req, res) => {
  try {
    const challengeData = {
      ...req.body,
      submittedBy: req.user.id
    };
    
    const challenge = new Challenge(challengeData);
    await challenge.save();
    
    res.status(201).json(challenge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Submit challenge (save github link)
exports.submitChallenge = async (req, res) => {
  try {
    const { githubLink } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    challenge.githubLink = githubLink;
    challenge.submittedBy = req.user.id;
    await challenge.save();
    
    res.json({ message: 'Challenge submitted successfully', challenge });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
