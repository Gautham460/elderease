import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, './.env') });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
});

async function findPatientID() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const User = mongoose.model('User', userSchema);
    
    // Find the primary demo elder user
    const user = await User.findOne({ email: 'demo@example.com' });
    if (user) {
      console.log('\n--- SUCCESS ---');
      console.log('PATIENT_ID_TO_SEARCH:', user._id.toString());
      console.log('PATIENT_NAME:', user.name);
      console.log('--- END ---\n');
    } else {
      console.log('Demo user NOT found. Please ensure the server has seeded the database.');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

findPatientID();
