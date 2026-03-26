import express from 'express';
import UserData from '../models/UserData.js';

const router = express.Router();

// Get whole user data
router.get('/:userId', async (req, res) => {
  try {
    let data = await UserData.findOne({ userId: req.params.userId });
    if (!data) {
      data = new UserData({ userId: req.params.userId });
      await data.save();
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Patch user data (merge array/object partials)
router.patch('/:userId', async (req, res) => {
  try {
    // Prevent overriding the ID
    const { userId, _id, ...updatePayload } = req.body;
    
    let data = await UserData.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: updatePayload },
      { new: true, upsert: true }
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
