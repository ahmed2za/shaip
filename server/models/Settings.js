const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    default: 'موقع تقييم الشركات'
  },
  siteDescription: {
    type: String,
    required: true,
    default: 'منصة لتقييم ومراجعة الشركات'
  },
  privacyPolicy: {
    type: String,
    required: true,
    default: 'سياسة الخصوصية الافتراضية'
  },
  aboutUs: {
    type: String,
    required: true,
    default: 'معلومات عن الموقع'
  },
  pricing: {
    type: String,
    required: true,
    default: 'معلومات الأسعار'
  },
  homeImages: [{
    url: String,
    title: String,
    description: String,
    order: Number
  }],
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  contact: {
    email: String,
    phone: String,
    address: String
  },
  features: [{
    title: String,
    description: String,
    icon: String
  }],
  metaTags: {
    title: String,
    description: String,
    keywords: String
  },
  customCss: String,
  customJs: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
settingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);
