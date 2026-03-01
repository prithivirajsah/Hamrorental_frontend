import React, { useMemo, useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Users,
  CalendarDays,
  Plus,
  Menu,
  X,
  LogOut,
  Shield,
  FileCheck,
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import HeaderIcon from './assets/Headericon.png';

const pageMetaByPath = {
  '/admin': { name: 'Dashboard', key: 'AdminDashboard' },
  '/admin/vehicles': { name: 'Vehicles', key: 'AdminVehicles' },
  '/admin/bookings': { name: 'Bookings', key: 'AdminBookings' },
  '/admin/users': { name: 'Users', key: 'AdminUsers' },
  '/admin/documents': { name: 'Documents', key: 'AdminDocuments' },
  '/admin/add-post': { name: 'Add Post', key: 'AddPost' },
};

const navItems = [
  { name: 'Dashboard', to: '/admin', key: 'AdminDashboard', icon: LayoutDashboard },
  { name: 'Vehicles', to: '/admin/vehicles', key: 'AdminVehicles', icon: Car },
  { name: 'Bookings', to: '/admin/bookings', key: 'AdminBookings', icon: CalendarDays },
  { name: 'Users', to: '/admin/users', key: 'AdminUsers', icon: Users },
  { name: 'Documents', to: '/admin/documents', key: 'AdminDocuments', icon: FileCheck },
];

export default function Layout() {
  const location = useLocation();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPage = useMemo(
    () => pageMetaByPath[location.pathname] || { name: 'Dashboard', key: 'AdminDashboard' },
    [location.pathname]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
          <p className="text-gray-500 mt-2">You need admin privileges to access this area.</p>
          <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline text-sm">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100">
          <div className="flex items-center">
            <img src={HeaderIcon} alt="HamroRental" className="h-10 w-auto object-contain" />
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ name, to, key, icon: Icon }) => (
            <Link
              key={key}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentPage.key === key
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${currentPage.key === key ? 'text-indigo-600' : ''}`} />
              {name}
            </Link>
          ))}

          <div className="pt-3 mt-2 border-t border-gray-100">
            <Link
              to="/admin/add-post"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentPage.key === 'AddPost'
                  ? 'bg-indigo-700 text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add New Vehicle
            </Link>
          </div>
        </nav>

        {user && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-white">{user.full_name?.[0]?.toUpperCase() || 'A'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.full_name || 'Admin'}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-semibold text-gray-900">{currentPage.name}</span>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
