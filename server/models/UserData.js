import mongoose from 'mongoose';

const userDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  medicalInfo: { type: Object, default: {} },
  sosAlerts: { type: Array, default: [] },
  familyMembers: { type: Array, default: [] },
  emergencyContacts: { type: Array, default: [] },
  metrics: { type: Array, default: [] },
  reminders: { type: Array, default: [] },
  healthReminders: { type: Array, default: [] },
  hydrationEntries: { type: Array, default: [] },
  hydrationGoal: { type: Number, default: 2000 },
  activityLogs: { type: Array, default: [] }
}, { minimize: false });

export default mongoose.model('UserData', userDataSchema);
