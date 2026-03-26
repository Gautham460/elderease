import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  helperId: String,
  helperName: String,
  serviceId: String,
  serviceName: String,
  scheduledDate: Date,
  scheduledTime: String,
  address: String,
  status: { type: String, default: 'pending' },
  notes: String,
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ServiceRequest', serviceRequestSchema);
