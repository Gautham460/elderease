import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const caregiverSchema = new mongoose.Schema({
  caregiverId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true // sparse allows null/undefined to not throw unique error if it was marked unique
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    default: 'caregiver'
  },
  phone: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
caregiverSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
caregiverSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Caregiver = mongoose.model('Caregiver', caregiverSchema);
export default Caregiver;
