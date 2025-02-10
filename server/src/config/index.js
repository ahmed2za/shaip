require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/reviews',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
};
