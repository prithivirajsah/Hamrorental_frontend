import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminData } from '@/api/adminDataClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Car, Users, CalendarDays, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => adminData.entities.Vehicle.list('-created_date', 100),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => adminData.entities.Booking.list('-created_date', 50),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminData.entities.User.list(),
  });

  const totalRevenue = bookings
    .filter(b => b.status === 'completed' || b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
  const availableVehicles = vehicles.filter(v => v.status === 'available').length;

  const stats = [
    { label: 'Total Vehicles', value: vehicles.length, sub: `${availableVehicles} available`, icon: Car, color: 'bg-blue-50 text-blue-600' },
    { label: 'Registered Users', value: users.length, sub: 'all time', icon: Users, color: 'bg-purple-50 text-purple-600' },
    { label: 'Active Bookings', value: activeBookings, sub: `${bookings.length} total`, icon: CalendarDays, color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: 'confirmed + completed', icon: DollarSign, color: 'bg-green-50 text-green-600' },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const recentBookings = bookings.slice(0, 8);

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
                {recentBookings.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">No bookings yet</td></tr>
                ) : recentBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <p className="text-sm font-medium text-gray-900">{booking.user_name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{booking.user_email}</p>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-600">{booking.vehicle_name || 'N/A'}</td>
                    <td className="px-6 py-3.5 text-sm font-medium text-gray-900">${booking.total_price?.toLocaleString() || '0'}</td>
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
            <h2 className="font-semibold text-gray-900">Fleet Status</h2>
            <Link to={createPageUrl('AdminVehicles')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Manage →</Link>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Available', status: 'available', color: 'bg-green-500' },
              { label: 'Unavailable', status: 'unavailable', color: 'bg-red-400' },
              { label: 'Maintenance', status: 'maintenance', color: 'bg-amber-400' },
            ].map(({ label, status, color }) => {
              const count = vehicles.filter(v => v.status === status).length;
              const pct = vehicles.length ? Math.round((count / vehicles.length) * 100) : 0;
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
            <h3 className="text-sm font-semibold text-gray-700 mb-3">By Category</h3>
            <div className="space-y-2">
              {['SUV', 'Sedan', 'Luxury', 'Electric'].map(cat => {
                const count = vehicles.filter(v => v.category === cat).length;
                if (!count) return null;
                return (
                  <div key={cat} className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{cat}</span>
                    <span className="text-sm font-medium text-gray-800 bg-gray-50 px-2 py-0.5 rounded">{count}</span>
                  </div>
                );
              })}
              {vehicles.length === 0 && <p className="text-sm text-gray-400">No vehicles added yet</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
