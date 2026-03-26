import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
});

async function findPatientID() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const User = mongoose.model('User', userSchema);
    
    const user = await User.findOne({ email: 'demo@example.com' });
    if (user) {
      console.log('ID_TO_SEARCH:', user._id.toString());
      console.log('NAME:', user.name);
    } else {
      console.log('Demo user NOT found.');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

findPatientID();
