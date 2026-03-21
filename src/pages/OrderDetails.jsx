import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Car,
  CircleDollarSign,
  ClipboardList,
  Hash,
  User,
} from 'lucide-react';
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

const normalizeBooking = (payload) => {
  if (!payload) return null;
  if (payload?.id) return payload;
  if (payload?.booking?.id) return payload.booking;
  if (payload?.data?.id) return payload.data;
  return null;
};

const getStatusClass = (status) => statusClasses[status] || 'bg-gray-100 text-gray-700';

export default function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const prefetchedBooking = useMemo(() => location.state?.booking || null, [location.state]);

  const [booking, setBooking] = useState(prefetchedBooking);
  const [isLoading, setIsLoading] = useState(!prefetchedBooking);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.getBookingById(id);
        const normalized = normalizeBooking(response);
        if (!normalized) {
          setError('Booking details are unavailable.');
          setBooking(null);
          return;
        }
        setBooking(normalized);
      } catch (err) {
        if (prefetchedBooking?.id && Number(prefetchedBooking.id) === Number(id)) {
          setBooking(prefetchedBooking);
        } else {
          setBooking(null);
          setError(err?.response?.data?.detail || 'Failed to load booking details.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id, prefetchedBooking]);

  return (
    <div className="min-h-screen bg-[#F3F2F2] text-black">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Orders
            </Link>
            <h1 className="text-3xl font-bold mt-2">Booking Details</h1>
          </div>
          {booking?.status && (
            <span className={`inline-flex w-fit px-3 py-1.5 rounded-full text-sm font-medium capitalize ${getStatusClass(booking.status)}`}>
              {booking.status}
            </span>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
          {isLoading ? (
            <p className="text-gray-500 text-center py-12">Loading booking details...</p>
          ) : error ? (
            <p className="text-red-600 text-center py-12">{error}</p>
          ) : !booking ? (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-700">Booking not found</h2>
              <p className="text-gray-500 mt-1 mb-5">The booking you requested could not be found.</p>
              <Link
                to="/orders"
                className="inline-flex items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-medium transition-colors"
              >
                Go to My Orders
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="border border-gray-200 rounded-xl p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900">{booking.vehicle_name || 'Vehicle Booking'}</h2>
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
                  <p className="text-sm text-gray-500">Booked on {formatDate(booking.created_at)}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <section className="border border-gray-200 rounded-xl p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Schedule</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600"><span className="font-medium text-gray-800">Start Date:</span> {formatDate(booking.start_date)}</p>
                    <p className="text-gray-600"><span className="font-medium text-gray-800">End Date:</span> {formatDate(booking.end_date)}</p>
                    <p className="text-gray-600"><span className="font-medium text-gray-800">Duration:</span> {booking.total_days || 0} day(s)</p>
                  </div>
                </section>

                <section className="border border-gray-200 rounded-xl p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Payment</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600"><span className="font-medium text-gray-800">Total Price:</span> Rs. {Number(booking.total_price || 0).toLocaleString()}</p>
                    <p className="text-gray-600"><span className="font-medium text-gray-800">Status:</span> <span className="capitalize">{booking.status || 'pending'}</span></p>
                    <p className="text-gray-600"><span className="font-medium text-gray-800">Booking ID:</span> #{booking.id}</p>
                  </div>
                </section>
              </div>

              <section className="border border-gray-200 rounded-xl p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Booking Meta</h3>
                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1 inline-flex items-center gap-1"><Hash className="w-3.5 h-3.5" /> Booking Ref</p>
                    <p className="font-medium text-gray-800">#{booking.id}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1 inline-flex items-center gap-1"><User className="w-3.5 h-3.5" /> Customer</p>
                    <p className="font-medium text-gray-800">{booking.user_name || 'Current User'}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Created At</p>
                    <p className="font-medium text-gray-800">{formatDate(booking.created_at)}</p>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}