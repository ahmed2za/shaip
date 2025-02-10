module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/reviewsdb',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: '24h',
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  uploadDir: 'uploads',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  email: {
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    }
  }
};
