import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { Mail, Search, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AdminMessages() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-messages', search],
    queryFn: () => api.getAdminMessages({ search: search || undefined, limit: 500 }),
  });

  const filtered = messages;

  const topics = [...new Set(messages.map(m => m.topic))];
  const topicCounts = topics.reduce((acc, topic) => {
    acc[topic] = (acc[topic] || 0) + 1;
    return acc;
  }, {});

  const topicList = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-sm text-gray-500">{messages.length} total messages</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{messages.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Topics</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{topics.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Today</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {messages.filter(m => {
              const msgDate = new Date(m.created_at).toDateString();
              const today = new Date().toDateString();
              return msgDate === today;
            }).length}
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search messages..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No messages found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {filtered.map(message => (
                <button
                  key={message.id}
                  onClick={() => setSelected(message)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-l-4 ${
                    selected?.id === message.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{message.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">{message.email}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{message.message}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Details */}
        {selected && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{selected.subject}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">From</label>
                  <p className="text-gray-900 font-medium">{selected.full_name}</p>
                  <p className="text-sm text-gray-600">{selected.email}</p>
                </div>

                {selected.phone_number && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Phone</label>
                    <p className="text-gray-900">{selected.phone_number}</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Topic</label>
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {selected.topic}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Received</label>
                  <p className="text-gray-900 text-sm">{formatDate(selected.created_at)}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <label className="block text-xs font-medium text-gray-500 uppercase mb-3">Message</label>
              <div className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                  {selected.message}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <button
                onClick={() => {
                  // Open email client
                  window.open(`mailto:${selected.email}?subject=Re: ${selected.subject}`);
                }}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                Reply via Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
