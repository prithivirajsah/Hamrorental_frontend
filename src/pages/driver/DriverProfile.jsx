import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserCircle2, Mail, Phone, BadgeCheck, FileText, CalendarDays, Pencil, MapPin, Globe, Upload } from 'lucide-react';
import api from '@/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { config } from '@/config/config';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const licenseStatusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  verified: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function DriverProfile() {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    location: '',
    country: '',
  });

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['driver-profile'],
    queryFn: () => api.getProfile(),
  });

  const { data: license, isLoading: isLicenseLoading } = useQuery({
    queryKey: ['driver-license-status'],
    queryFn: () => api.getMyDriverLicense(),
    retry: false,
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      location: profile.location || '',
      country: profile.country || '',
    });
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (payload) => api.updateProfile(payload),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['driver-profile'] });
      await refreshUser();
      setIsEditing(false);
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('profile_photo', file);
      return api.uploadProfilePhoto(formData);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['driver-profile'] });
      await refreshUser();
    },
  });

  const resolveAssetUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${config.API_BASE_URL}${url}`;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      full_name: form.full_name,
      phone: form.phone || null,
      location: form.location || null,
      country: form.country || null,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Driver Profile</h1>
        <p className="text-sm text-gray-500">View your account and license verification details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {isProfileLoading ? (
            <p className="text-gray-400">Loading profile...</p>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border border-indigo-100">
                  {profile?.profile_image_url ? (
                    <img
                      src={resolveAssetUrl(profile.profile_image_url)}
                      alt={profile?.full_name || 'Driver'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle2 className="w-8 h-8 text-indigo-600" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{profile?.full_name || 'Driver'}</p>
                  <p className="text-sm text-gray-500 capitalize">{profile?.role || 'driver'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-4 h-4" />
                  {uploadPhotoMutation.isPending ? 'Uploading...' : 'Upload Photo'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    disabled={uploadPhotoMutation.isPending}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadPhotoMutation.mutate(file);
                      e.target.value = '';
                    }}
                  />
                </label>
                {uploadPhotoMutation.isError && (
                  <p className="text-sm text-red-600">
                    {uploadPhotoMutation.error?.response?.data?.detail || 'Failed to upload photo'}
                  </p>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500 uppercase mb-1">Full Name</p>
                    <Input
                      value={form.full_name}
                      onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Phone</p>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+977..."
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Location</p>
                    <Input
                      value={form.location}
                      onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Country</p>
                    <Input
                      value={form.country}
                      onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                      placeholder="Country"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setForm({
                          full_name: profile?.full_name || '',
                          phone: profile?.phone || '',
                          location: profile?.location || '',
                          country: profile?.country || '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>

                  {updateMutation.isError && (
                    <p className="sm:col-span-2 text-sm text-red-600">
                      {updateMutation.error?.response?.data?.detail || 'Failed to update profile'}
                    </p>
                  )}
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoCard icon={Mail} label="Email" value={profile?.email || '—'} />
                    <InfoCard icon={Phone} label="Phone" value={profile?.phone || '—'} />
                    <InfoCard icon={MapPin} label="Location" value={profile?.location || '—'} />
                    <InfoCard icon={Globe} label="Country" value={profile?.country || '—'} />
                    <InfoCard icon={CalendarDays} label="Joined" value={formatDate(profile?.created_at)} />
                    <InfoCard icon={BadgeCheck} label="Account Status" value={profile?.is_active ? 'Active' : 'Inactive'} />
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
                      <Pencil className="w-4 h-4" /> Edit Profile
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h2 className="font-semibold text-gray-900">License Status</h2>
          </div>

          {isLicenseLoading ? (
            <p className="text-sm text-gray-400">Loading license...</p>
          ) : !license ? (
            <p className="text-sm text-gray-500">No license submitted yet.</p>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase">License Number</p>
                <p className="text-sm font-medium text-gray-900">{license.license_number || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Expiry Date</p>
                <p className="text-sm font-medium text-gray-900">{license.license_expiry_date || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Verification</p>
                <span className={`inline-flex mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${licenseStatusStyles[license.verification_status] || 'bg-gray-100 text-gray-700'}`}>
                  {license.verification_status || 'pending'}
                </span>
              </div>
              {license.rejection_reason && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Rejection Reason</p>
                  <p className="text-sm text-red-600">{license.rejection_reason}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-gray-500" />
        <p className="text-xs text-gray-500 uppercase">{label}</p>
      </div>
      <p className="text-sm font-medium text-gray-900 break-all">{value}</p>
    </div>
  );
}
