import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Caregiver from '../models/Caregiver.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, caregiverId } = req.body;
    
    if (role === 'caregiver') {
      let caregiver = caregiverId ? await Caregiver.findOne({ caregiverId }) : await Caregiver.findOne({ email });
      if (caregiver) return res.status(400).json({ message: 'Caregiver already exists with this ID or Email' });

      caregiver = new Caregiver({ 
        name, 
        email, 
        password, 
        caregiverId: caregiverId || `CG-${Math.floor(1000 + Math.random() * 9000)}`, // auto-generate if not provided
        role: 'caregiver'
      });
      await caregiver.save();
      
      const token = jwt.sign({ id: caregiver._id, role: caregiver.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.status(201).json({ token, user: { id: caregiver._id, name, email, role: 'caregiver', caregiverId: caregiver.caregiverId } });
    }

    // Default to User
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, role });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, name, email, role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, caregiverId, password, role } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : '';

    // Standard Database lookup based on role
    if (role === 'caregiver') {
      let caregiver = caregiverId 
        ? await Caregiver.findOne({ caregiverId }) 
        : await Caregiver.findOne({ email: normalizedEmail });

      // Seed Demo Caregiver if not exists
      if (!caregiver && normalizedEmail === 'caregiver@example.com') {
        caregiver = new Caregiver({ 
          name: 'Demo Caregiver', 
          email: 'caregiver@example.com', 
          password: 'password', 
          role: 'caregiver',
          caregiverId: 'CG-0001'
        });
        await caregiver.save();
      }

      if (!caregiver) return res.status(400).json({ message: 'Caregiver account not found.' });

      const isMatch = await caregiver.comparePassword(password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid password. Cross-check failed.' });

      const token = jwt.sign({ id: caregiver._id, role: caregiver.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, user: { id: caregiver._id, name: caregiver.name, email: caregiver.email, role: caregiver.role, caregiverId: caregiver.caregiverId } });
    }

    // Default to Elder/User
    let user = await User.findOne({ email: normalizedEmail });
    
    // Seed Demo User if not exists (One-time DB creation)
    if (!user && normalizedEmail === 'demo@example.com') {
      user = new User({ name: 'Elder Demo User', email: 'demo@example.com', password: 'password', role: 'elder' });
      await user.save();
    }

    if (!user) return res.status(400).json({ message: 'No registered account found with this email.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid database password.' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Google Login (Mock/Token Verification)
router.post('/google', async (req, res) => {
  try {
    const { token, name, email, profileImage } = req.body;
    
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ 
        name, 
        email, 
        password: Math.random().toString(36).slice(-10), 
        role: 'caregiver' 
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token: jwtToken, user: { id: user._id, name: user.name, email: user.email, role: user.role, profileImage } });
  } catch (error) {
    res.status(500).json({ message: 'Google authentication failed', error: error.message });
  }
});

// Verify Auth Token and Load Profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = (await User.findById(req.user.id)) || (await Caregiver.findById(req.user.id));
    if (!user) return res.status(404).json({ message: 'User profile not found in database.' });
    
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role, caregiverId: user.caregiverId });
  } catch (error) {
    res.status(500).json({ message: 'Server verification failed.', error: error.message });
  }
});

export default router;
