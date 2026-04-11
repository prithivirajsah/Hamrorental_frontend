import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import { FileCheck, Search, CheckCircle2, XCircle, Clock, Eye, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { config } from '@/config/config';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function AdminDriverLicenseVerification() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewContentType, setPreviewContentType] = useState(null);

  const resolveAssetUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const normalized = url.replace(/\\/g, '/');
    if (normalized.startsWith('/')) {
      return `${config.API_BASE_URL}${normalized}`;
    }
    return `${config.API_BASE_URL}/${normalized}`;
  };

  useEffect(() => {
    let isMounted = true;
    let objectUrl = null;

    const cleanup = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };

    if (!selected?.id) {
      setPreviewUrl(null);
      setPreviewContentType(null);
      return () => cleanup();
    }

    const loadPreview = async () => {
      try {
        const blob = await api.getAdminDriverLicenseImage(selected.id);
        objectUrl = URL.createObjectURL(blob);
        if (isMounted) {
          setPreviewUrl(objectUrl);
          setPreviewContentType(blob.type || null);
        }
      } catch {
        if (isMounted) {
          setPreviewUrl(resolveAssetUrl(selected.license_image_url));
          const lower = (selected.license_image_url || '').toLowerCase();
          if (lower.endsWith('.pdf')) {
            setPreviewContentType('application/pdf');
          } else {
            setPreviewContentType(null);
          }
        }
      }
    };

    loadPreview();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [selected?.id, selected?.license_image_url]);

  const { data: licenses = [], isLoading } = useQuery({
    queryKey: ['driver-licenses'],
    queryFn: () => api.getAllDriverLicenses({ limit: 300 }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, action, rejection_reason }) => api.verifyDriverLicense(id, action, rejection_reason),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['driver-licenses'] });
      if (selected?.id === vars.id) {
        setSelected((prev) => prev ? ({ ...prev, verification_status: vars.action === 'verify' ? 'verified' : 'rejected', rejection_reason: vars.rejection_reason || null }) : null);
      }
      setShowRejectInput(false);
      setRejectionReason('');
    },
  });

  const filtered = licenses.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch =
      item.user_name?.toLowerCase().includes(q)
      || item.user_email?.toLowerCase().includes(q)
      || item.license_number?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || item.verification_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: licenses.length,
    pending: licenses.filter((item) => item.verification_status === 'pending').length,
    verified: licenses.filter((item) => item.verification_status === 'verified').length,
    rejected: licenses.filter((item) => item.verification_status === 'rejected').length,
  };

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    verified: { color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    rejected: { color: 'bg-red-100 text-red-700', icon: XCircle },
  };

  const handleApprove = (item) => {
    updateMutation.mutate({ id: item.id, action: 'verify' });
  };

  const handleReject = (item) => {
    updateMutation.mutate({ id: item.id, action: 'reject', rejection_reason: rejectionReason });
  };

  const handleRejectSubmit = (item) => {
    if (!rejectionReason.trim()) {
      return;
    }
    handleReject(item);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Driver Licenses</h1>
        <p className="text-sm text-gray-500">{counts.pending} pending review</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', key: 'all', color: 'text-gray-900' },
          { label: 'Pending', key: 'pending', color: 'text-yellow-600' },
          { label: 'Verified', key: 'verified', color: 'text-green-600' },
          { label: 'Rejected', key: 'rejected', color: 'text-red-500' },
        ].map(({ label, key, color }) => (
          <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{counts[key]}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'verified', 'rejected'].map((itemStatus) => (
            <button
              key={itemStatus}
              onClick={() => setStatusFilter(itemStatus)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${statusFilter === itemStatus ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {itemStatus} <span className="ml-1 text-xs opacity-70">({counts[itemStatus]})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className={`${selected ? 'lg:col-span-2' : 'lg:col-span-5'} bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden`}>
          {isLoading ? (
            <div className="p-12 text-center text-[#4e19d2]">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <FileCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No licenses found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((item) => {
                const cfg = statusConfig[item.verification_status] || statusConfig.pending;
                const Icon = cfg.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${selected?.id === item.id ? 'bg-indigo-50/60' : ''}`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-white">
                        {item.user_name?.[0]?.toUpperCase() || item.user_email?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.user_name || 'Unknown User'}</p>
                      <p className="text-xs text-gray-400 truncate">{item.license_number}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                        <Icon className="w-3 h-3" />
                        {item.verification_status}
                      </span>
                      <Eye className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {selected && (
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Driver License Details</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{selected.user_name?.[0]?.toUpperCase() || '?'}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selected.user_name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{selected.user_email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">License Number</p>
                  <p className="font-medium text-gray-800">{selected.license_number || '—'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Expiry Date</p>
                  <p className="font-medium text-gray-800">{selected.license_expiry_date || '—'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Submitted</p>
                  <p className="font-medium text-gray-800">{formatDate(selected.created_at)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Status</p>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusConfig[selected.verification_status]?.color}`}>
                    {selected.verification_status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Uploaded License</p>
                {selected.license_image_url ? (
                  previewContentType?.includes('pdf') ? (
                    <iframe
                      src={previewUrl || resolveAssetUrl(selected.license_image_url)}
                      title="License"
                      className="w-full h-64 rounded-xl border border-gray-100 bg-white"
                    />
                  ) : (
                    <a href={previewUrl || resolveAssetUrl(selected.license_image_url)} target="_blank" rel="noopener noreferrer">
                      <img
                        src={previewUrl || resolveAssetUrl(selected.license_image_url)}
                        alt="License"
                        className="w-full h-52 object-contain rounded-xl border border-gray-100 bg-white hover:opacity-90 transition-opacity"
                      />
                    </a>
                  )
                ) : (
                  <div className="py-6 text-center text-gray-400 text-sm bg-gray-50 rounded-xl">No image uploaded</div>
                )}
              </div>

              {selected.rejection_reason && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                  <p className="text-xs font-medium text-red-600 mb-0.5">Rejection Reason</p>
                  <p className="text-sm text-red-700">{selected.rejection_reason}</p>
                </div>
              )}

              {selected.verification_status === 'pending' && (
                <div className="pt-2 border-t border-gray-100 space-y-3">
                  {showRejectInput ? (
                    <div className="space-y-2">
                      <Input
                        placeholder="Reason for rejection..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-red-500 hover:bg-red-600"
                          onClick={() => handleRejectSubmit(selected)}
                          disabled={updateMutation.isPending}
                        >
                          Confirm Reject
                        </Button>
                        <Button variant="outline" onClick={() => setShowRejectInput(false)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 gap-1.5"
                        onClick={() => handleApprove(selected)}
                        disabled={updateMutation.isPending}
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
                        onClick={() => setShowRejectInput(true)}
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
