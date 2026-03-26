import express from 'express';
import Medication from '../models/Medication.js';

const router = express.Router();

// Get all medications for a user
router.get('/:userId', async (req, res) => {
  try {
    const medications = await Medication.find({ user: req.params.userId });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a medication
router.post('/', async (req, res) => {
  try {
    const medication = new Medication(req.body);
    await medication.save();
    res.status(201).json(medication);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update status
router.patch('/:id', async (req, res) => {
  try {
    const medication = await Medication.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
