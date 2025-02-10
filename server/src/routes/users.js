const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if the user is updating their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const { name, email, avatar, gender } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (avatar) updateData.avatar = avatar;
    if (gender) updateData.gender = gender;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
