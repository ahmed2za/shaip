const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, gender, avatar } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل مسبقاً'
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      gender,
      avatar
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { id: user._id },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء التسجيل'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تسجيل الدخول'
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح'
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({
      success: false,
      message: 'غير مصرح'
    });
  }
});

module.exports = router;
