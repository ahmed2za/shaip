const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  logo: {
    type: DataTypes.STRING
  },
  website: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  averageRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('active', 'pending', 'suspended'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['name'],
      type: 'FULLTEXT'
    },
    {
      fields: ['category']
    }
  ]
});

module.exports = Company;
