const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config');
const connectDB = require('./config/database');
const passport = require('passport');
const socketIo = require('socket.io');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', config.uploadDir)));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/reviews', require('./routes/reviews'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'حدث خطأ في السيرفر'
  });
});

// Start server
const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: config.clientUrl,
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

module.exports = { app, io };
