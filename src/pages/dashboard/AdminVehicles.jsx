import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Search, Edit2, Trash2, Car } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import config from '@/config/config';


const toAbsoluteImageUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${config.API_BASE_URL}${normalized}`;
};

export default function AdminVehicles() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles', 'admin', search, filter],
    queryFn: async () => {
      const ownerRole = filter === 'all' ? undefined : filter;
      const data = await api.getAdminPosts({
        limit: 300,
        search: search || undefined,
        owner_role: ownerRole,
      });
      return Array.isArray(data) ? data : [];
    },
    refetchInterval: 10000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', 'admin'] });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      alert('Failed to delete vehicle: ' + (error?.response?.data?.detail || 'Unknown error'));
    },
  });

  const filtered = vehicles;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-sm text-gray-500">{vehicles.length} total vehicles</p>
        </div>
        <Link to={createPageUrl('AddPost')}>
          <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
            <Plus className="w-4 h-4" /> Add Vehicle
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search vehicles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'user', 'admin', 'driver'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === s ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400">Loading vehicles...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Car className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No vehicles found</p>
            <Link to={createPageUrl('AddPost')} className="text-indigo-600 text-sm mt-1 inline-block hover:underline">
              Add your first vehicle
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Vehicle</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Owner</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Price/Day</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Location</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(vehicle => (
                  <tr key={vehicle.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {toAbsoluteImageUrl(vehicle.image_urls?.[0]) ? (
                          <img
                            src={toAbsoluteImageUrl(vehicle.image_urls?.[0])}
                            alt={vehicle.post_title}
                            className="w-12 h-9 object-cover rounded-lg flex-shrink-0"
                            onError={(event) => {
                              event.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Car className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{vehicle.post_title}</p>
                          <p className="text-xs text-gray-400">ID: {vehicle.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="font-medium text-gray-800">{vehicle.owner_name || `User #${vehicle.owner_id}`}</div>
                      <div className="text-xs text-gray-500 capitalize">{vehicle.owner_role || 'user'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{vehicle.category || '—'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Rs. {vehicle.price_per_day}/day</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{vehicle.location || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`${createPageUrl('AddPost')}?id=${vehicle.id}`}>
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => { 
                            if (window.confirm('Delete this vehicle? This action cannot be undone.')) {
                              deleteMutation.mutate(vehicle.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
