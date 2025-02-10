const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  pros: {
    type: DataTypes.TEXT
  },
  cons: {
    type: DataTypes.TEXT
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'reported'),
    defaultValue: 'pending'
  },
  isVerifiedPurchase: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  helpfulVotes: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  reports: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  reportCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['rating']
    },
    {
      fields: ['status']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Review;
