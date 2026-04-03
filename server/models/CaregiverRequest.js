import mongoose from 'mongoose';

const caregiverRequestSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caregiver',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('CaregiverRequest', caregiverRequestSchema);
