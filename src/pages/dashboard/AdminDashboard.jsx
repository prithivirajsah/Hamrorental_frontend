import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Car, Users, CalendarDays } from 'lucide-react';

const NepaliRupeeIcon = ({ className = '' }) => (
  <span className={`${className} text-[11px] font-semibold leading-none`}>Rs</span>
);

const FEATURE_PRESETS = [
  'Automatic',
  'PB 95',
  'Air Conditioner',
  'GPS Navigation',
  'Bluetooth',
  'Rear Camera',
  'Parking Sensors',
  'Cruise Control',
  'ABS',
  'Airbags',
  'USB Charging',
  'Sunroof',
];

export default function AdminDashboard() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.getAdminDashboard({ recent_limit: 8 }),
  });

  const statsSource = dashboard?.stats || {};
  const recentBookings = dashboard?.recent_bookings || [];
  const bookingBreakdown = dashboard?.booking_status_breakdown || {};

  const totalUsers = statsSource.total_users || 0;
  const totalPosts = statsSource.total_posts || 0;
  const totalBookings = statsSource.total_bookings || 0;
  const confirmedBookings = statsSource.confirmed_bookings || 0;
  const completedBookings = statsSource.completed_bookings || 0;
  const pendingBookings = statsSource.pending_bookings || 0;
  const totalRevenue = statsSource.total_revenue || 0;

  const stats = [
    { label: 'Total Vehicles', value: totalPosts, sub: 'all listings', icon: Car, color: 'bg-blue-50 text-blue-600' },
    { label: 'Registered Users', value: totalUsers, sub: 'all time', icon: Users, color: 'bg-purple-50 text-purple-600' },
    { label: 'Confirmed Bookings', value: confirmedBookings, sub: `${totalBookings} total`, icon: CalendarDays, color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, sub: 'confirmed + completed', icon: NepaliRupeeIcon, color: 'bg-green-50 text-green-600' },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
            <Link to={createPageUrl('AdminBookings')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Vehicle</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">Loading dashboard...</td></tr>
                ) : recentBookings.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">No bookings yet</td></tr>
                ) : recentBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <p className="text-sm font-medium text-gray-900">{booking.user_name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{booking.user_email}</p>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-600">{booking.vehicle_name || 'N/A'}</td>
                    <td className="px-6 py-3.5 text-sm font-medium text-gray-900">Rs. {booking.total_price?.toLocaleString() || '0'}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Status Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Booking Status</h2>
            <Link to={createPageUrl('AdminVehicles')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Manage →</Link>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Pending', status: 'pending', color: 'bg-yellow-500' },
              { label: 'Confirmed', status: 'confirmed', color: 'bg-blue-500' },
              { label: 'Completed', status: 'completed', color: 'bg-green-500' },
              { label: 'Cancelled', status: 'cancelled', color: 'bg-red-500' },
            ].map(({ label, status, color }) => {
              const count = bookingBreakdown[status] || 0;
              const pct = totalBookings ? Math.round((count / totalBookings) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Booking Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Pending</span>
                <span className="text-sm font-medium text-gray-800 bg-gray-50 px-2 py-0.5 rounded">{pendingBookings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Confirmed</span>
                <span className="text-sm font-medium text-gray-800 bg-gray-50 px-2 py-0.5 rounded">{confirmedBookings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Completed</span>
                <span className="text-sm font-medium text-gray-800 bg-gray-50 px-2 py-0.5 rounded">{completedBookings}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Feature Presets</h3>
            <div className="flex flex-wrap gap-2">
              {FEATURE_PRESETS.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  {feature}
                </span>
              ))}
            </div>
            <Link
              to={createPageUrl('AddPost')}
              className="inline-block mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Use these in Add Vehicle →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
