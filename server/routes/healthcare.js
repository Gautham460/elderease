import express from 'express';
import Appointment from '../models/Appointment.js';
import MedicineOrder from '../models/MedicineOrder.js';
import ServiceRequest from '../models/ServiceRequest.js';

const router = express.Router();

// Get appointments for a user
router.get('/appointments/:userId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    // Map _id to id so frontend works correctly
    res.json(appointments.map(a => ({ ...a.toObject(), id: a._id.toString() })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add appointment
router.post('/appointments', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({ ...appointment.toObject(), id: appointment._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update appointment status
router.patch('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ ...appointment.toObject(), id: appointment._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get medicine orders for a user
router.get('/orders/:userId', async (req, res) => {
  try {
    const orders = await MedicineOrder.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders.map(o => ({ ...o.toObject(), id: o._id.toString() })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add medicine order
router.post('/orders', async (req, res) => {
  try {
    const order = new MedicineOrder(req.body);
    await order.save();
    res.status(201).json({ ...order.toObject(), id: order._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status
router.patch('/orders/:id', async (req, res) => {
  try {
    const order = await MedicineOrder.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ ...order.toObject(), id: order._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get service requests for a user
router.get('/service-requests/:userId', async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(requests.map(r => ({ ...r.toObject(), id: r._id.toString() })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add service request
router.post('/service-requests', async (req, res) => {
  try {
    const request = new ServiceRequest(req.body);
    await request.save();
    res.status(201).json({ ...request.toObject(), id: request._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update service request status
router.patch('/service-requests/:id', async (req, res) => {
  try {
    const request = await ServiceRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ ...request.toObject(), id: request._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
