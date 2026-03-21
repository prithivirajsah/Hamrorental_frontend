import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, Car, CircleDollarSign, ClipboardList } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api';

const statusClasses = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getStatusClass = (status) => statusClasses[status] || 'bg-gray-100 text-gray-700';

const normalizeBookings = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.bookings)) return payload.bookings;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export default function Orders() {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.getMyBookings({ limit: 100 });
        setBookings(normalizeBookings(response));
      } catch (err) {
        setError(err?.response?.data?.detail || 'Failed to load your orders.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statuses = ['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled'];

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'all') return bookings;
    return bookings.filter((booking) => booking.status === statusFilter);
  }, [bookings, statusFilter]);

  const stats = useMemo(() => ({
    total: bookings.length,
    active: bookings.filter((booking) => booking.status === 'active' || booking.status === 'confirmed').length,
    completed: bookings.filter((booking) => booking.status === 'completed').length,
    cancelled: bookings.filter((booking) => booking.status === 'cancelled').length,
  }), [bookings]);

  const detailsBasePath = location.pathname.startsWith('/user/orders') ? '/user/orders' : '/orders';

  return (
    <div className="min-h-screen bg-[#F3F2F2] text-black">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-gray-600 mt-1">Track your booking status and rental history.</p>
          </div>
          <Link
            to="/vehicles"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-medium transition-colors"
          >
            Book Another Vehicle
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold mt-1">{stats.completed}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="text-2xl font-bold mt-1 text-red-600">{stats.cancelled}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
          {isLoading ? (
            <p className="text-gray-500 text-center py-12">Loading your orders...</p>
          ) : error ? (
            <p className="text-red-600 text-center py-12">{error}</p>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-700">No orders found</h2>
              <p className="text-gray-500 mt-1 mb-5">You don’t have any bookings for this filter yet.</p>
              <Link
                to="/vehicles"
                className="inline-flex items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-medium transition-colors"
              >
                Explore Vehicles
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Link
                  key={booking.id}
                  to={`${detailsBasePath}/${booking.id}`}
                  state={{ booking }}
                  className="block border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">{booking.vehicle_name || 'Vehicle Booking'}</h3>
                      <p className="text-sm text-gray-500">Order ID: #{booking.id}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="w-4 h-4" />
                          {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Car className="w-4 h-4" />
                          {booking.total_days || 0} day(s)
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-medium text-gray-800">
                          <CircleDollarSign className="w-4 h-4" />
                          Rs. {Number(booking.total_price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusClass(booking.status)}`}>
                        {booking.status || 'pending'}
                      </span>
                      <span className="text-xs font-medium text-indigo-600">View details</span>
                      <p className="text-xs text-gray-500">Booked on {formatDate(booking.created_at)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}