const sequelize = require('./database');
const User = require('../models/User');
const Company = require('../models/Company');
const Review = require('../models/Review');

// Define relationships
User.hasMany(Review);
Review.belongsTo(User);

Company.hasMany(Review);
Review.belongsTo(Company);

// Sync database
const initDb = async () => {
  try {
    await sequelize.sync({ force: true }); // Be careful with force: true in production
    console.log('Database synchronized successfully');

    // Create admin user
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123', // Change this in production
      role: 'admin',
      isVerified: true
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = initDb;
