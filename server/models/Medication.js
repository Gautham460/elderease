import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: String,
  frequency: String,
  time: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['active', 'completed', 'discontinued'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Medication = mongoose.model('Medication', medicationSchema);
export default Medication;
