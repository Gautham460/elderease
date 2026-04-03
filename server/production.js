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
import adminRoutes from './routes/admin.js';

console.log('**************************************************');
console.log('🚀 ELDEREASE PRODUCTION SERVER IS STARTING...');
console.log('**************************************************');

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
app.use('/api/admin', adminRoutes);

// 2. STATIC FRONTEND
// Serves the 'dist' folder from the root
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// 3. REACT ROUTER CATCH-ALL
// Every non-API request gets the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Database Connection with explicit error logging
const mongodb_uri = process.env.MONGODB_URI;

if (!mongodb_uri) {
  console.error('CRITICAL ERROR: MONGODB_URI is missing from environment variables!');
  console.log('Available environment variables:', Object.keys(process.env));
  process.exit(1);
}

mongoose.connect(mongodb_uri)
  .then(() => {
    console.log('✅ Production Server: Connected to MongoDB');
    const server = app.listen(PORT, () => {
      console.log(`🚀 ElderEase LIVE on port ${PORT}`);
    });
    
    server.on('error', (err) => {
      console.error('❌ Server startup error:', err);
      process.exit(1);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error Details:');
    console.error(err);
    process.exit(1);
  });
