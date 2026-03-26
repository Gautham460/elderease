import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true, // e.g., 'Blood Pressure', 'Heart Rate', 'Blood Sugar'
    enum: ['Blood Pressure', 'Heart Rate', 'Blood Sugar', 'Weight', 'Temperature']
  },
  value: {
    type: String,
    required: true
  },
  unit: String,
  recordedAt: {
    type: Date,
    default: Date.now
  },
  notes: String
});

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);
export default HealthRecord;
