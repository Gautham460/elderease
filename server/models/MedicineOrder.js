import mongoose from 'mongoose';

const orderedMedicineSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number
});

const medicineOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pharmacyId: String,
  pharmacyName: String,
  medicines: [orderedMedicineSchema],
  totalAmount: Number,
  status: { type: String, default: 'pending' },
  deliveryAddress: String,
  orderedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MedicineOrder', medicineOrderSchema);
