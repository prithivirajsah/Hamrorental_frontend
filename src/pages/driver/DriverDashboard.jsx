import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Car, CalendarDays, CircleCheck, Star } from 'lucide-react';
import api from '@/api';
import { Link } from 'react-router-dom';
import { RatingDisplay } from '@/components/ui/rating';

export default function DriverDashboard() {
  const { data: dashboardStats } = useQuery({
    queryKey: ['driver', 'dashboard-stats'],
    queryFn: async () => {
      try {
        return await api.getDriverDashboardStats();
      } catch {
        return null;
      }
    },
  });

  const { data: reviewSummary } = useQuery({
    queryKey: ['driver', 'review-summary'],
    queryFn: async () => {
      try {
        return await api.getMyDriverReviewSummary();
      } catch {
        return null;
      }
    },
  });

  const stats = {
    requests: Number(dashboardStats?.hire_requests ?? dashboardStats?.hireRequests ?? 0),
    pendingRequests: Number(dashboardStats?.pending_requests ?? dashboardStats?.pendingRequests ?? 0),
    cars: Number(dashboardStats?.my_cars ?? dashboardStats?.myCars ?? 0),
    activeBookings: Number(dashboardStats?.active_bookings ?? dashboardStats?.activeBookings ?? 0),
    totalReviews: Number(reviewSummary?.total_reviews ?? reviewSummary?.totalReviews ?? 0),
    averageRating: Number(reviewSummary?.average_rating ?? reviewSummary?.averageRating ?? 0),
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Driver Rating</h2>
            <p className="text-sm text-gray-500">Based on customer feedback from completed bookings.</p>
          </div>
          <Link to="/driver/reviews" className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            View All Reviews
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Total Driver Reviews</p>
            <p className="text-2xl font-bold mt-1 text-gray-900">{stats.totalReviews}</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Average Driver Rating</p>
            <div className="mt-2 flex items-center gap-2">
              <RatingDisplay value={stats.averageRating} showValue valueClassName="font-semibold" />
              <Star className="w-4 h-4 text-indigo-500" />
            </div>
          </div>
        </div>
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
          <Link to="/driver/reviews" className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            View Driver Reviews
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
