import React, { useState } from 'react';
import { MapPin, Phone, Clock, Search, Calendar, Building2, User, ShoppingCart, X, Package } from 'lucide-react';
import { Card, Badge } from '../components/common/Card';
import { useServiceStore } from '../store/serviceStore';
import { MainLayout } from '../components/layout/MainLayout';
import type { Doctor, Appointment, Pharmacy, MedicineOrder, OrderedMedicine } from '../types';

type TabType = 'hospitals' | 'doctors' | 'appointments' | 'pharmacies' | 'orders';

export const HealthcarePage: React.FC = () => {
  const { 
    hospitals, doctors, appointments, pharmacies, medicineOrders,
    searchHospitals, searchDoctors, bookAppointment, cancelAppointment,
    searchPharmacies, orderMedicine, cancelOrder
  } = useServiceStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('hospitals');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  
  // Pharmacy state
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [cartItems, setCartItems] = useState<OrderedMedicine[]>([]);
  const [medicineName, setMedicineName] = useState('');
  
  // Booking state
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  const specialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Oncology', 'Dental', 'Eye Care'];

  const filteredHospitals = searchQuery ? searchHospitals(searchQuery) : hospitals;
  const filteredDoctors = selectedSpecialty ? searchDoctors(selectedSpecialty) : doctors;

  const handleAddToCart = () => {
    if (medicineName.trim()) {
      setCartItems([...cartItems, { name: medicineName, quantity: 1, price: Math.floor(Math.random() * 200) + 50 }]);
      setMedicineName('');
    }
  };

  const handlePlaceOrder = () => {
    if (selectedPharmacy && cartItems.length > 0) {
      const order: MedicineOrder = {
        id: Date.now().toString(),
        pharmacyId: selectedPharmacy.id,
        pharmacyName: selectedPharmacy.name,
        medicines: cartItems,
        totalAmount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'pending',
        deliveryAddress: '123 Main Street, Downtown',
        orderedAt: new Date(),
      };
      orderMedicine(order);
      setCartItems([]);
      setSelectedPharmacy(null);
    }
  };

  const handleBookAppointment = () => {
    if (selectedDoctor && bookingDate && bookingTime) {
      const appointment: Appointment = {
        id: Date.now().toString(),
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        hospitalId: selectedDoctor.hospitalId,
        hospitalName: selectedDoctor.hospitalName,
        specialty: selectedDoctor.specialty,
        date: new Date(bookingDate),
        time: bookingTime,
        status: 'pending',
      };
      bookAppointment(appointment);
      setSelectedDoctor(null);
      setBookingDate('');
      setBookingTime('');
    }
  };

  const renderTabs = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {[
        { id: 'hospitals', label: 'Hospitals', icon: Building2 },
        { id: 'doctors', label: 'Doctors', icon: User },
        { id: 'appointments', label: 'My Appointments', icon: Calendar },
        { id: 'pharmacies', label: 'Pharmacies', icon: ShoppingCart },
        { id: 'orders', label: 'Medicine Orders', icon: Package },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as TabType)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <tab.icon size={18} />
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderHospitals = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
        <input
          type="text"
          placeholder="Search hospitals or specialties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div className="grid gap-4">
        {filteredHospitals.map((hospital) => (
          <Card key={hospital.id} variant="primary">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-neutral-900">{hospital.name}</h3>
                  {hospital.emergencyAvailable && (
                    <Badge status="danger" size="sm">Emergency</Badge>
                  )}
                </div>
                <p className="text-sm text-neutral-600 mt-1 flex items-center gap-1">
                  <MapPin size={14} /> {hospital.address}
                </p>
                <p className="text-sm text-neutral-600 flex items-center gap-1 mt-1">
                  <Phone size={14} /> {hospital.phone}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {hospital.specialties.map((specialty) => (
                    <span key={specialty} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary-600">{hospital.rating} ⭐</p>
                <p className="text-sm text-neutral-500">{hospital.distance} km</p>
                <div className={`mt-2 px-3 py-1 rounded-full text-sm ${hospital.isOpen ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
                  {hospital.isOpen ? 'Open' : 'Closed'}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDoctors = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Specialties</option>
          {specialties.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      
      <div className="grid gap-4">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} variant="primary">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-neutral-900">{doctor.name}</h3>
                <p className="text-sm text-primary-600">{doctor.specialty}</p>
                <p className="text-sm text-neutral-600 mt-1">{doctor.hospitalName}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                  <span>⭐ {doctor.rating}</span>
                  <span>💼 {doctor.experience} years</span>
                  <span>💰 ${doctor.consultationFee}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctor(doctor)}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Book
              </button>
            </div>
            
            {/* Availability */}
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <p className="text-sm font-semibold text-neutral-700 mb-2">Availability this week:</p>
              <div className="flex flex-wrap gap-2">
                {doctor.availability.map((day) => (
                  <div key={day.day} className="text-center">
                    <p className="text-xs text-neutral-500">{day.day}</p>
                    <div className="flex gap-1 mt-1">
                      {day.slots.filter(s => s.available).slice(0, 2).map((slot) => (
                        <span key={slot.time} className="px-2 py-1 bg-success-100 text-success-700 text-xs rounded">
                          {slot.time}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-600 font-medium">No appointments yet</p>
            <p className="text-sm text-neutral-500 mt-1">Book an appointment with a doctor</p>
          </div>
        </Card>
      ) : (
        appointments.map((apt) => (
          <Card key={apt.id} variant={apt.status === 'confirmed' ? 'success' : apt.status === 'cancelled' ? 'warning' : 'primary'}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-neutral-900">{apt.doctorName}</h3>
                <p className="text-sm text-primary-600">{apt.specialty}</p>
                <p className="text-sm text-neutral-600">{apt.hospitalName}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock size={14} className="text-neutral-500" />
                  <span className="text-sm text-neutral-600">
                    {new Date(apt.date).toLocaleDateString()} at {apt.time}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  status={apt.status === 'confirmed' ? 'success' : apt.status === 'cancelled' ? 'danger' : 'warning'}
                  size="sm"
                >
                  {apt.status}
                </Badge>
                {apt.status === 'pending' && (
                  <button
                    onClick={() => cancelAppointment(apt.id)}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );

  const renderPharmacies = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
        <input
          type="text"
          placeholder="Search pharmacies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div className="grid gap-4">
        {(searchQuery ? searchPharmacies(searchQuery) : pharmacies).map((pharmacy) => (
          <Card key={pharmacy.id} variant="primary">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-neutral-900">{pharmacy.name}</h3>
                <p className="text-sm text-neutral-600 mt-1 flex items-center gap-1">
                  <MapPin size={14} /> {pharmacy.address}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                  <span>⭐ {pharmacy.rating}</span>
                  <span>📍 {pharmacy.distance} km</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm ${pharmacy.isOpen ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
                  {pharmacy.isOpen ? 'Open' : 'Closed'}
                </div>
                {pharmacy.deliveryAvailable && (
                  <Badge status="success" size="sm" className="mt-2">Delivery</Badge>
                )}
                <button
                  onClick={() => setSelectedPharmacy(pharmacy)}
                  className="mt-2 block w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg"
                >
                  Order Medicine
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      {medicineOrders.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-600 font-medium">No medicine orders yet</p>
            <p className="text-sm text-neutral-500 mt-1">Order medicines from local pharmacies</p>
          </div>
        </Card>
      ) : (
        medicineOrders.map((order) => (
          <Card key={order.id} variant={order.status === 'delivered' ? 'success' : 'primary'}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-neutral-900">{order.pharmacyName}</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  {order.medicines.map(m => `${m.name} (x${m.quantity})`).join(', ')}
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  Ordered: {new Date(order.orderedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-neutral-500">Delivery: {order.deliveryAddress}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary-600">${order.totalAmount}</p>
                <Badge 
                  status={
                    order.status === 'delivered' ? 'success' : 
                    order.status === 'cancelled' ? 'danger' : 'warning'
                  }
                  size="sm"
                  className="mt-1"
                >
                  {order.status.replace('_', ' ')}
                </Badge>
                {order.status === 'pending' && (
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold">Healthcare Services</h1>
          <p className="text-primary-100 mt-2">Find hospitals, doctors, and order medicines</p>
        </div>

        {renderTabs()}

        {activeTab === 'hospitals' && renderHospitals()}
        {activeTab === 'doctors' && renderDoctors()}
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'pharmacies' && renderPharmacies()}
        {activeTab === 'orders' && renderOrders()}
      </div>

      {/* Doctor Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Book Appointment</h3>
              <button onClick={() => setSelectedDoctor(null)} className="p-2 hover:bg-neutral-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-xl">
                <p className="font-semibold">{selectedDoctor.name}</p>
                <p className="text-sm text-neutral-600">{selectedDoctor.specialty}</p>
                <p className="text-sm text-neutral-500">{selectedDoctor.hospitalName}</p>
                <p className="text-sm text-primary-600 mt-2">Consultation: ${selectedDoctor.consultationFee}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Time</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                >
                  <option value="">Select time</option>
                  {selectedDoctor.availability.flatMap(d => 
                    d.slots.filter(s => s.available).map(s => (
                      <option key={s.time} value={s.time}>{s.time}</option>
                    ))
                  )}
                </select>
              </div>
              
              <button
                onClick={handleBookAppointment}
                disabled={!bookingDate || !bookingTime}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl disabled:opacity-50"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pharmacy Order Modal */}
      {selectedPharmacy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Order from {selectedPharmacy.name}</h3>
              <button onClick={() => setSelectedPharmacy(null)} className="p-2 hover:bg-neutral-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="Medicine name"
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg"
                />
                <button
                  onClick={handleAddToCart}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg"
                >
                  Add
                </button>
              </div>
              
              {cartItems.length > 0 && (
                <div className="space-y-2">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                      <span>{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">${item.price}</span>
                        <button
                          onClick={() => setCartItems(cartItems.filter((_, i) => i !== index))}
                          className="text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
                  </div>
                </div>
              )}
              
              <button
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl disabled:opacity-50"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};
