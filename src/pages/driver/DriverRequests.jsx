import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Phone, User } from 'lucide-react';
import {
  driverRequestStorageEvents,
  getDriverRequests,
  updateDriverRequestStatus,
} from '@/utils/driverRequestStorage';
import { useAuth } from '@/contexts/AuthContext';

const formatDateTime = (date, time) => {
  if (!date) return '—';
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return time ? `${formattedDate} at ${time}` : formattedDate;
};

const statusClasses = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function DriverRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const refresh = () => setRequests(getDriverRequests());
    refresh();

    window.addEventListener(driverRequestStorageEvents.DRIVER_REQUESTS_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener(driverRequestStorageEvents.DRIVER_REQUESTS_UPDATED_EVENT, refresh);
    };
  }, []);

  const statuses = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return requests;
    return requests.filter((item) => item.status === statusFilter);
  }, [requests, statusFilter]);

  const counts = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status] = status === 'all' ? requests.length : requests.filter((item) => item.status === status).length;
      return acc;
    }, {});
  }, [requests]);

  const updateStatus = (requestId, status) => {
    updateDriverRequestStatus(requestId, status, user);
    setRequests(getDriverRequests());
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hire Requests</h1>
        <p className="text-sm text-gray-500">View requests submitted by customers who need a driver.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              statusFilter === status
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status} <span className="ml-1 text-xs opacity-80">({counts[status] || 0})</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No hire requests found.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((request) => (
              <div key={request.id} className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                      <User className="w-4 h-4" />
                      {request.customer_name}
                    </div>
                    <p className="text-sm text-gray-600 inline-flex items-center gap-2">
                      <Phone className="w-4 h-4" /> {request.phone || 'No phone provided'}
                    </p>
                    <p className="text-sm text-gray-600 inline-flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {request.pickup_location || 'No pickup location'}
                    </p>
                    <p className="text-sm text-gray-600 inline-flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" /> {formatDateTime(request.pickup_date, request.pickup_time)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Service:</span> {request.service_type || 'Driver Hire'}
                    </p>
                    {request.note ? (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-800">Note:</span> {request.note}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-start lg:items-end gap-2">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusClasses[request.status] || 'bg-gray-100 text-gray-700'}`}>
                      {request.status || 'pending'}
                    </span>
                    <select
                      value={request.status || 'pending'}
                      onChange={(event) => updateStatus(request.id, event.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 capitalize"
                    >
                      {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(request.created_at).toLocaleString()}
                    </p>
                    {request.status === 'confirmed' && request.chat_thread_id ? (
                      <Link
                        to={`/driver/chats?thread=${request.chat_thread_id}`}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Open Chat
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
