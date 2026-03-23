import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Car, CalendarDays, CircleCheck } from 'lucide-react';
import { getDriverRequests } from '@/utils/driverRequestStorage';
import api from '@/api';
import { Link } from 'react-router-dom';

export default function DriverDashboard() {
  const { data: myCars = [] } = useQuery({
    queryKey: ['driver', 'my-cars'],
    queryFn: async () => {
      try {
        const response = await api.getMyPosts({ limit: 200 });
        return Array.isArray(response) ? response : [];
      } catch {
        return [];
      }
    },
  });

  const { data: myBookings = [] } = useQuery({
    queryKey: ['driver', 'my-bookings'],
    queryFn: async () => {
      try {
        const response = await api.getOwnerBookings({ limit: 200 });
        return Array.isArray(response) ? response : [];
      } catch {
        return [];
      }
    },
  });

  const requests = useMemo(() => getDriverRequests(), []);

  const stats = {
    requests: requests.length,
    pendingRequests: requests.filter((item) => item.status === 'pending').length,
    cars: myCars.length,
    activeBookings: myBookings.filter((item) => ['confirmed', 'active'].includes(item.status)).length,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
        <p className="text-sm text-gray-500">Manage hire requests and your own car listings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Hire Requests" value={stats.requests} icon={Bell} />
        <StatCard title="Pending Requests" value={stats.pendingRequests} icon={CalendarDays} />
        <StatCard title="My Cars" value={stats.cars} icon={Car} />
        <StatCard title="Active Bookings" value={stats.activeBookings} icon={CircleCheck} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/driver/requests" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
            View Hire Requests
          </Link>
          <Link to="/driver/vehicles" className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Manage My Cars
          </Link>
          <Link to="/driver/add-post" className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Add New Car
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon className="w-4 h-4 text-indigo-500" />
      </div>
      <p className="text-2xl font-bold mt-2 text-gray-900">{value}</p>
    </div>
  );
}
