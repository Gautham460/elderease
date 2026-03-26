import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import medRoutes from './routes/medications.js';
import aiRoutes from './routes/ai.js';
import healthcareRoutes from './routes/healthcare.js';
import userDataRoutes from './routes/userData.js';
import sosRoutes from './routes/sos.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medications', medRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/healthcare', healthcareRoutes);
app.use('/api/user-data', userDataRoutes);
app.use('/api/sos', sosRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Elder-Ease API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
