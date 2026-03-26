import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import medRoutes from './routes/medications.js';
import aiRoutes from './routes/ai.js';
import healthcareRoutes from './routes/healthcare.js';
import userDataRoutes from './routes/userData.js';
import sosRoutes from './routes/sos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/medications', medRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/healthcare', healthcareRoutes);
app.use('/api/user-data', userDataRoutes);
app.use('/api/sos', sosRoutes);

// 2. STATIC FRONTEND
// Serves the 'dist' folder from the root
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// 3. REACT ROUTER CATCH-ALL
// Every non-API request gets the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Production Server: Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 ElderEase LIVE on port ${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
