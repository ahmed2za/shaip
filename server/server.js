require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config');

// Initialize express
const app = express();

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.max
});
app.use('/api/', limiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, config.uploadDir)));

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/company', require('./routes/company'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = config.port;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
