import React, { useState } from 'react';
import { Search, Star, Phone, MapPin, Calendar, Clock, X, User, Shield, Briefcase } from 'lucide-react';
import { Card, Badge } from '../components/common/Card';
import { useServiceStore } from '../store/serviceStore';
import { MainLayout } from '../components/layout/MainLayout';
import type { HomeHelper, ServiceRequest } from '../types';

type TabType = 'helpers' | 'requests';

export const HomeAssistancePage: React.FC = () => {
  const { 
    homeHelpers, serviceRequests,
    searchHomeHelpers, requestService, cancelServiceRequest 
  } = useServiceStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('helpers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('');
  
  // Booking state
  const [selectedHelper, setSelectedHelper] = useState<HomeHelper | null>(null);
  const [selectedServiceItem, setSelectedServiceItem] = useState<HomeHelper['services'][0] | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingAddress, setBookingAddress] = useState('123 Main Street, Downtown');
  const [bookingNotes, setBookingNotes] = useState('');

  const serviceTypes = ['Cooking', 'Cleaning', 'Laundry', 'General Maintenance'];

  const filteredHelpers = searchQuery || selectedService 
    ? searchHomeHelpers(selectedService)
    : homeHelpers;

  const handleBookService = () => {
    if (selectedHelper && selectedServiceItem && bookingDate && bookingTime) {
      const request: ServiceRequest = {
        id: Date.now().toString(),
        helperId: selectedHelper.id,
        helperName: selectedHelper.name,
        serviceId: selectedServiceItem.id,
        serviceName: selectedServiceItem.name,
        scheduledDate: new Date(bookingDate),
        scheduledTime: bookingTime,
        address: bookingAddress,
        status: 'pending',
        notes: bookingNotes,
        totalAmount: selectedServiceItem.price,
      };
      requestService(request);
      setSelectedHelper(null);
      setSelectedServiceItem(null);
      setBookingDate('');
      setBookingTime('');
      setBookingNotes('');
    }
  };

  const renderTabs = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {[
        { id: 'helpers', label: 'Browse Helpers', icon: User },
        { id: 'requests', label: 'My Requests', icon: Calendar },
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

  const renderHelpers = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Services</option>
          {serviceTypes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {filteredHelpers.map((helper) => (
          <Card key={helper.id} variant="primary">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">{helper.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-neutral-500">
                      {helper.verified && <Shield size={14} className="text-green-500" />}
                      <span>{helper.verified ? 'Verified' : 'Unverified'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-neutral-600">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" />
                    {helper.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} />
                    {helper.experience} years
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    ${helper.hourlyRate}/hr
                  </span>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-neutral-500 mb-2">Services:</p>
                  <div className="flex flex-wrap gap-2">
                    {helper.services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => {
                          setSelectedHelper(helper);
                          setSelectedServiceItem(service);
                        }}
                        className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm rounded-lg hover:bg-primary-100 transition-colors"
                      >
                        {service.name} - ${service.price}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between items-center">
              <span className="text-sm text-neutral-500">{helper.availability}</span>
              <a
                href={`tel:${helper.phone}`}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                <Phone size={16} />
                Contact
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-4">
      {serviceRequests.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-600 font-medium">No service requests yet</p>
            <p className="text-sm text-neutral-500 mt-1">Book a home helper for assistance</p>
          </div>
        </Card>
      ) : (
        serviceRequests.map((request) => (
          <Card key={request.id} variant={
            request.status === 'completed' ? 'success' : 
            request.status === 'cancelled' ? 'warning' : 'primary'
          }>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-neutral-900">{request.serviceName}</h3>
                  <Badge 
                    status={
                      request.status === 'completed' ? 'success' : 
                      request.status === 'cancelled' ? 'danger' : 
                      request.status === 'in_progress' ? 'warning' : 'info'
                    }
                    size="sm"
                  >
                    {request.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-600 mt-1">Helper: {request.helperName}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(request.scheduledDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {request.scheduledTime}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1">
                  <MapPin size={14} />
                  {request.address}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary-600">${request.totalAmount}</p>
                {request.status === 'pending' && (
                  <button
                    onClick={() => cancelServiceRequest(request.id)}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            {request.notes && (
              <div className="mt-3 pt-3 border-t border-neutral-100">
                <p className="text-sm text-neutral-600">Notes: {request.notes}</p>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold">Home Assistance Services</h1>
          <p className="text-primary-100 mt-2">Get help with cooking, cleaning, laundry, and more</p>
        </div>

        {renderTabs()}

        {activeTab === 'helpers' && renderHelpers()}
        {activeTab === 'requests' && renderRequests()}
      </div>

      {/* Booking Modal */}
      {selectedHelper && selectedServiceItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Book Service</h3>
              <button onClick={() => setSelectedHelper(null)} className="p-2 hover:bg-neutral-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedHelper.name}</p>
                    <p className="text-sm text-neutral-500">{selectedHelper.verified ? 'Verified Helper' : 'Helper'}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-200">
                  <p className="font-medium text-primary-600">{selectedServiceItem.name}</p>
                  <p className="text-sm text-neutral-600">{selectedServiceItem.description}</p>
                  <p className="text-lg font-bold mt-2">${selectedServiceItem.price}</p>
                </div>
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
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Address</label>
                <input
                  type="text"
                  value={bookingAddress}
                  onChange={(e) => setBookingAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Notes (optional)</label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Any special instructions..."
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                  rows={3}
                />
              </div>
              
              <button
                onClick={handleBookService}
                disabled={!bookingDate || !bookingTime}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl disabled:opacity-50"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};
