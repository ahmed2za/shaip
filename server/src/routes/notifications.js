const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.query.userId;
    const notifications = await req.db.notifications.find({ 
      user_id: userId 
    })
    .sort({ created_at: -1 })
    .limit(50);

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    await req.db.notifications.updateOne(
      { _id: notificationId },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

module.exports = router;
