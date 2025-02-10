const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { body, validationResult } = require('express-validator');

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update settings (Admin only)
router.put('/',
  [
    auth,
    admin,
    body('siteName').notEmpty().trim(),
    body('siteDescription').notEmpty().trim(),
    body('privacyPolicy').notEmpty(),
    body('aboutUs').notEmpty(),
    body('pricing').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let settings = await Settings.findOne();

      if (!settings) {
        settings = new Settings(req.body);
      } else {
        // Update existing settings
        Object.keys(req.body).forEach(key => {
          settings[key] = req.body[key];
        });
      }

      await settings.save();
      res.json(settings);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Update home images (Admin only)
router.put('/home-images',
  [auth, admin],
  async (req, res) => {
    try {
      const settings = await Settings.findOne();
      settings.homeImages = req.body.images;
      await settings.save();
      res.json(settings);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Update social media links (Admin only)
router.put('/social-media',
  [auth, admin],
  async (req, res) => {
    try {
      const settings = await Settings.findOne();
      settings.socialMedia = req.body.socialMedia;
      await settings.save();
      res.json(settings);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Update contact information (Admin only)
router.put('/contact',
  [auth, admin],
  async (req, res) => {
    try {
      const settings = await Settings.findOne();
      settings.contact = req.body.contact;
      await settings.save();
      res.json(settings);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Update features (Admin only)
router.put('/features',
  [auth, admin],
  async (req, res) => {
    try {
      const settings = await Settings.findOne();
      settings.features = req.body.features;
      await settings.save();
      res.json(settings);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Update meta tags (Admin only)
router.put('/meta-tags',
  [auth, admin],
  async (req, res) => {
    try {
      const settings = await Settings.findOne();
      settings.metaTags = req.body.metaTags;
      await settings.save();
      res.json(settings);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Update custom CSS (Admin only)
router.put('/custom-css',
  [auth, admin],
  async (req, res) => {
    try {
      const settings = await Settings.findOne();
      settings.customCss = req.body.customCss;
      await settings.save();
      res.json(settings);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Update custom JavaScript (Admin only)
router.put('/custom-js',
  [auth, admin],
  async (req, res) => {
    try {
      const settings = await Settings.findOne();
      settings.customJs = req.body.customJs;
      await settings.save();
      res.json(settings);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
