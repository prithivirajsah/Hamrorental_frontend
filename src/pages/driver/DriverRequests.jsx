import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Mail, MapPin, Phone, User } from 'lucide-react';
import api from '@/api';
import { toast } from 'react-toastify';

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
  approved: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-red-100 text-red-700',
};

const extractFromNote = (note = '') => {
  if (!note) return { customerName: '', phone: '', serviceType: '', pickupTime: '', plainNote: '' };

  const segments = String(note)
    .split('|')
    .map((segment) => segment.trim())
    .filter(Boolean);

  let customerName = '';
  let phone = '';
  let serviceType = '';
  let pickupTime = '';
  const plain = [];

  segments.forEach((segment) => {
    if (segment.startsWith('Customer:')) {
      customerName = segment.replace('Customer:', '').trim();
      return;
    }
    if (segment.startsWith('Phone:')) {
      phone = segment.replace('Phone:', '').trim();
      return;
    }
    if (segment.startsWith('Service:')) {
      serviceType = segment.replace('Service:', '').trim();
      return;
    }
    if (segment.startsWith('Pickup Time:')) {
      pickupTime = segment.replace('Pickup Time:', '').trim();
      return;
    }
    plain.push(segment);
  });

  return {
    customerName,
    phone,
    serviceType,
    pickupTime,
    plainNote: plain.join(' | '),
  };
};

export default function DriverRequests() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getOwnerHireRequests({ limit: 200 });
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Failed to load hire requests.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const statuses = ['all', 'pending', 'approved', 'rejected', 'cancelled'];

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

  const updateStatus = async (requestId, status) => {
    setUpdatingId(requestId);
    try {
      if (status === 'approved') {
        await api.acceptHireRequest(requestId);
      } else {
        await api.updateHireRequestStatus(requestId, { status });
      }
      await loadRequests();
      toast.success(`Request ${status} successfully.`);
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Failed to update request status.');
    } finally {
      setUpdatingId(null);
    }
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
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading hire requests...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No hire requests found.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((request) => (
              <div key={request.id} className="p-5">
                {(() => {
                  const details = extractFromNote(request.note);
                  return (
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                      <User className="w-4 h-4" />
                      {details.customerName || request.requester_name || `User #${request.requester_id}`}
                    </div>
                    <p className="text-sm text-gray-600 inline-flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {request.requester_email || 'No email provided'}
                    </p>
                    {details.phone ? (
                      <p className="text-sm text-gray-600 inline-flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {details.phone}
                      </p>
                    ) : null}
                    <p className="text-sm text-gray-600 inline-flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {request.pickup_location || 'No pickup location'}
                    </p>
                    <p className="text-sm text-gray-600 inline-flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" /> {formatDateTime(request.start_date, details.pickupTime)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Vehicle:</span> {request.vehicle_name || 'Vehicle'}
                    </p>
                    {details.serviceType ? (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-800">Service:</span> {details.serviceType}
                      </p>
                    ) : null}
                    {details.plainNote ? (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-800">Note:</span> {details.plainNote}
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
                      disabled={updatingId === request.id}
                      className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 capitalize"
                    >
                      {['pending', 'approved', 'rejected', 'cancelled'].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(request.created_at).toLocaleString()}
                    </p>
                    {request.status === 'approved' ? (
                      <Link
                        to={`/driver/chats?thread=${request.id}`}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Open Chat
                      </Link>
                    ) : null}
                  </div>
                </div>
                  );
                })()}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
