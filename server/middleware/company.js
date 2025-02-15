const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role !== 'company') {
      return res.status(403).json({ msg: 'Access denied. Company only.' });
    }

    next();
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
