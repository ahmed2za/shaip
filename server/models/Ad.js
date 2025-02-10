const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['banner', 'sidebar', 'popup', 'featured'],
    required: true
  },
  image: {
    type: String,
    required: function() {
      return ['banner', 'sidebar', 'featured'].includes(this.type);
    }
  },
  url: String,
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected', 'expired'],
    default: 'pending'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  targetAudience: {
    locations: [String],
    categories: [String],
    ageRange: {
      min: Number,
      max: Number
    }
  },
  budget: {
    amount: Number,
    currency: {
      type: String,
      default: 'SAR'
    }
  },
  adminComment: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps on save
adSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Check if ad is expired
adSchema.methods.isExpired = function() {
  return this.endDate < new Date();
};

// Increment views
adSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

// Increment clicks
adSchema.methods.incrementClicks = async function() {
  this.clicks += 1;
  return this.save();
};

// Calculate CTR (Click Through Rate)
adSchema.methods.getCTR = function() {
  return this.views > 0 ? (this.clicks / this.views) * 100 : 0;
};

module.exports = mongoose.model('Ad', adSchema);
