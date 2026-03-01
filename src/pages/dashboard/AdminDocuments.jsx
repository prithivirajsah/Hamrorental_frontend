import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminData } from '@/api/adminDataClient';
import { FileCheck, Search, CheckCircle2, XCircle, Clock, Eye, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function AdminDocuments() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => adminData.entities.Document.list('-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminData.entities.Document.update(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      if (selected?.id === vars.id) {
        setSelected(prev => ({ ...prev, ...vars.data }));
      }
      setShowRejectInput(false);
      setRejectionReason('');
    },
  });

  const filtered = documents.filter(d => {
    const matchSearch =
      d.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.user_email?.toLowerCase().includes(search.toLowerCase()) ||
      d.document_type?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || d.verification_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: documents.length,
    pending: documents.filter(d => d.verification_status === 'pending').length,
    approved: documents.filter(d => d.verification_status === 'approved').length,
    rejected: documents.filter(d => d.verification_status === 'rejected').length,
  };

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    approved: { color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    rejected: { color: 'bg-red-100 text-red-700', icon: XCircle },
  };

  const handleApprove = (doc) => {
    updateMutation.mutate({ id: doc.id, data: { verification_status: 'approved', rejection_reason: '' } });
  };

  const handleReject = (doc) => {
    updateMutation.mutate({ id: doc.id, data: { verification_status: 'rejected', rejection_reason: rejectionReason } });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Document Verification</h1>
        <p className="text-sm text-gray-500">{counts.pending} pending review</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', key: 'all', color: 'text-gray-900' },
          { label: 'Pending', key: 'pending', color: 'text-yellow-600' },
          { label: 'Approved', key: 'approved', color: 'text-green-600' },
          { label: 'Rejected', key: 'rejected', color: 'text-red-500' },
        ].map(({ label, key, color }) => (
          <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{counts[key]}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search by name, email, or type..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {s} <span className="ml-1 text-xs opacity-70">({counts[s]})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List */}
        <div className={`${selected ? 'lg:col-span-2' : 'lg:col-span-5'} bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden`}>
          {isLoading ? (
            <div className="p-12 text-center text-gray-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <FileCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No documents found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(doc => {
                const cfg = statusConfig[doc.verification_status] || statusConfig.pending;
                const Icon = cfg.icon;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelected(doc)}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${selected?.id === doc.id ? 'bg-indigo-50/60' : ''}`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-white">
                        {doc.user_name?.[0]?.toUpperCase() || doc.user_email?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.user_name || 'Unknown User'}</p>
                      <p className="text-xs text-gray-400 truncate">{doc.document_type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                        <Icon className="w-3 h-3" />
                        {doc.verification_status}
                      </span>
                      <Eye className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Document Details</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              {/* User Info */}
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
                  <p className="text-xs text-gray-400 mb-0.5">Document Type</p>
                  <p className="font-medium text-gray-800">{selected.document_type}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Document Number</p>
                  <p className="font-medium text-gray-800">{selected.document_number || '—'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Submitted</p>
                  <p className="font-medium text-gray-800">
                    {formatDate(selected.created_date)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Status</p>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusConfig[selected.verification_status]?.color}`}>
                    {selected.verification_status}
                  </span>
                </div>
              </div>

              {/* Document Images */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Uploaded Documents</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selected.front_image && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Front Side</p>
                      <a href={selected.front_image} target="_blank" rel="noopener noreferrer">
                        <img src={selected.front_image} alt="Front" className="w-full h-36 object-cover rounded-xl border border-gray-100 hover:opacity-90 transition-opacity" />
                      </a>
                    </div>
                  )}
                  {selected.back_image && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Back Side</p>
                      <a href={selected.back_image} target="_blank" rel="noopener noreferrer">
                        <img src={selected.back_image} alt="Back" className="w-full h-36 object-cover rounded-xl border border-gray-100 hover:opacity-90 transition-opacity" />
                      </a>
                    </div>
                  )}
                  {selected.selfie_image && (
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-400 mb-1">Selfie with Document</p>
                      <a href={selected.selfie_image} target="_blank" rel="noopener noreferrer">
                        <img src={selected.selfie_image} alt="Selfie" className="w-full h-40 object-cover rounded-xl border border-gray-100 hover:opacity-90 transition-opacity" />
                      </a>
                    </div>
                  )}
                  {!selected.front_image && !selected.back_image && !selected.selfie_image && (
                    <div className="sm:col-span-2 py-6 text-center text-gray-400 text-sm bg-gray-50 rounded-xl">No images uploaded</div>
                  )}
                </div>
              </div>

              {selected.rejection_reason && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                  <p className="text-xs font-medium text-red-600 mb-0.5">Rejection Reason</p>
                  <p className="text-sm text-red-700">{selected.rejection_reason}</p>
                </div>
              )}

              {selected.notes && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-medium text-gray-500 mb-0.5">Notes</p>
                  <p className="text-sm text-gray-700">{selected.notes}</p>
                </div>
              )}

              {/* Actions */}
              {selected.verification_status === 'pending' && (
                <div className="pt-2 border-t border-gray-100 space-y-3">
                  {showRejectInput ? (
                    <div className="space-y-2">
                      <Input
                        placeholder="Reason for rejection..."
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-red-500 hover:bg-red-600"
                          onClick={() => handleReject(selected)}
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

              {selected.verification_status !== 'pending' && (
                <div className="pt-2 border-t border-gray-100">
                  <Button
                    variant="outline"
                    className="w-full text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                    onClick={() => updateMutation.mutate({ id: selected.id, data: { verification_status: 'pending' } })}
                    disabled={updateMutation.isPending}
                  >
                    Reset to Pending
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
