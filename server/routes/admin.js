import express from 'express';
import CaregiverRequest from '../models/CaregiverRequest.js';
import User from '../models/User.js';
import Caregiver from '../models/Caregiver.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Elder requesting a caregiver
router.post('/request-caregiver', auth, async (req, res) => {
  try {
    const { caregiverId } = req.body;
    const patientId = req.user.id;

    if (req.user.role !== 'elder' && req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Only patients/elders can request a caregiver.' });
    }

    // Check if caregiver exists by ID
    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found.' });
    }
    
    // Check for existing pending request
    const existingReq = await CaregiverRequest.findOne({ patientId, caregiverId, status: 'pending' });
    if (existingReq) {
      return res.status(400).json({ message: 'You already have a pending request for this caregiver.' });
    }

    const request = new CaregiverRequest({
      patientId,
      caregiverId,
      status: 'pending'
    });
    await request.save();

    res.status(201).json({ message: 'Request submitted to admin for approval.', request });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin getting all requests
router.get('/requests', auth, adminAuth, async (req, res) => {
  try {
    const requests = await CaregiverRequest.find()
      .populate('patientId', 'name email')
      .populate('caregiverId', 'name email caregiverId')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin approves/rejects caregiver request
router.put('/requests/:id', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await CaregiverRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Can't change after it's approved/rejected
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is already ' + request.status });
    }

    request.status = status;
    await request.save();

    // If approved, you might want to link the patient and caregiver.
    // Assuming there's a field in User or something. But since there wasn't one found natively, I'll let it just be approved.
    
    res.json({ message: `Request successfully ${status}.`, request });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
