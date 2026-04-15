import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Send, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/api';

const formatDateTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString();
};

function getCurrentUserId(user) {
  return Number(user?.id ?? user?.user_id ?? 0);
}

function normalizeHireRequest(request) {
  if (!request) return null;

  return {
    id: String(request.id),
    hire_request_id: request.id,
    title: request.vehicle_name || request.owner_name || `Hire request #${request.id}`,
    status: request.status || 'pending',
    pickup_location: request.pickup_location || '',
    return_location: request.return_location || '',
    start_date: request.start_date || '',
    end_date: request.end_date || '',
    requested_price: request.requested_price,
    note: request.note || '',
    requester_id: request.requester_id,
    requester_name: request.requester_name,
    requester_email: request.requester_email,
    owner_id: request.owner_id,
    owner_name: request.owner_name,
    owner_email: request.owner_email,
    vehicle_name: request.vehicle_name,
    updated_at: request.updated_at || request.created_at,
    last_message: request.last_message || null,
  };
}

function getThreadPeer(thread, currentUserId) {
  if (!thread) return null;

  if (Number(thread.requester_id) === Number(currentUserId)) {
    return {
      user_id: thread.owner_id,
      name: thread.owner_name || 'Driver',
      email: thread.owner_email || '',
    };
  }

  return {
    user_id: thread.requester_id,
    name: thread.requester_name || 'Customer',
    email: thread.requester_email || '',
  };
}

function ChatPanel() {
  const { user } = useAuth();
  const location = useLocation();
  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const currentUserId = useMemo(() => getCurrentUserId(user), [user]);

  const refreshThreads = async () => {
    if (!user?.id) {
      setThreads([]);
      setSelectedThreadId('');
      setMessages([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const collected = await api.getHireRequestChats();

      const deduped = new Map();
      (Array.isArray(collected) ? collected : []).forEach((request) => {
        if (!request?.id) return;
        deduped.set(String(request.id), normalizeHireRequest(request));
      });

      const nextThreads = Array.from(deduped.values()).sort((a, b) => {
        const left = new Date(b.updated_at || b.created_at || 0).getTime();
        const right = new Date(a.updated_at || a.created_at || 0).getTime();
        return left - right;
      });

      setThreads(nextThreads);

      const queryThreadId = new URLSearchParams(location.search).get('thread');
      if (queryThreadId && nextThreads.some((thread) => thread.id === queryThreadId)) {
        setSelectedThreadId(queryThreadId);
        return;
      }

      if (!nextThreads.some((thread) => thread.id === selectedThreadId)) {
        setSelectedThreadId(nextThreads[0]?.id || '');
      }
    } catch (fetchError) {
      setError(fetchError?.response?.data?.detail || 'Failed to load chats.');
      setThreads([]);
      setSelectedThreadId('');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshThreads();
  }, [user, location.search]);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) || null,
    [threads, selectedThreadId]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedThread?.messages?.length]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedThread?.hire_request_id) {
        setMessages([]);
        return;
      }

      try {
        const response = await api.getHireRequestMessages(selectedThread.hire_request_id);
        setMessages(Array.isArray(response) ? response : []);
      } catch {
        setMessages([]);
      }
    };

    loadMessages();
  }, [selectedThread?.hire_request_id, selectedThread?.status, selectedThread?.updated_at]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!selectedThread?.hire_request_id || !messageInput.trim()) return;
    if (selectedThread.status !== 'approved') return;

    setIsSending(true);
    try {
      await api.sendHireRequestMessage(selectedThread.hire_request_id, {
        message: messageInput,
      });

      setMessageInput('');
      await refreshThreads();
      const refreshedMessages = await api.getHireRequestMessages(selectedThread.hire_request_id);
      setMessages(Array.isArray(refreshedMessages) ? refreshedMessages : []);
    } catch (sendError) {
      setError(sendError?.response?.data?.detail || 'Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Driver Hire Chat</h1>
        <p className="text-sm text-gray-500">Message your matched driver or customer after the hire request is created and approved.</p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-10 text-center text-gray-500">
          Loading chats...
        </div>
      ) : threads.length === 0 ? (
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-10 text-center">
          <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-700 font-medium">No active chat yet</p>
          <p className="text-sm text-gray-500 mt-1">Create a hire request and wait for approval to start chat.</p>
          {user?.role === 'user' ? (
            <Link to="/hire-a-driver" className="inline-flex mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium">
              Hire a Driver
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700">Conversations ({threads.length})</p>
            </div>
            <div className="max-h-[560px] overflow-y-auto divide-y divide-gray-100">
              {threads.map((thread) => {
                const peer = getThreadPeer(thread, currentUserId);
                const lastMessage = thread.last_message;
                return (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      selectedThreadId === thread.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900 truncate">{peer?.name || thread.title}</p>
                    <p className="text-xs text-gray-500 truncate mt-1">{lastMessage?.message || thread.note || 'No message yet'}</p>
                    <p className="text-[11px] text-indigo-600 mt-1 capitalize">{thread.status}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{formatDateTime(thread.updated_at)}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm rounded-2xl flex flex-col min-h-[560px]">
            {selectedThread ? (
              <>
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500">Status: <span className="capitalize">{selectedThread.status}</span></p>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedThread.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Pickup: {selectedThread.pickup_location || 'N/A'} • Return: {selectedThread.return_location || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Dates: {selectedThread.start_date || 'N/A'} to {selectedThread.end_date || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Chat with {getThreadPeer(selectedThread, currentUserId)?.name || 'the other party'}
                  </p>
                </div>

                <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                      <MessageSquare className="w-9 h-9 mx-auto mb-3 text-gray-300" />
                      <p>{selectedThread.status === 'approved' ? 'No messages yet. Start the conversation.' : 'Chat opens after approval.'}</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isMine = Number(message.sender_id) === Number(currentUserId);

                      return (
                        <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${isMine ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                            <p className="text-xs opacity-80 mb-1">{isMine ? 'You' : message.sender_name || 'Driver'}</p>
                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                            <p className={`text-[11px] mt-1 ${isMine ? 'text-indigo-100' : 'text-gray-400'}`}>
                              {formatDateTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex items-center gap-2">
                  <input
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    placeholder={selectedThread.status === 'approved' ? 'Type your message' : 'Chat is available after approval'}
                    disabled={selectedThread.status !== 'approved' || isSending}
                  />
                  <button
                    type="submit"
                    disabled={selectedThread.status !== 'approved' || isSending}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium"
                  >
                    <Send className="w-4 h-4" /> Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <User className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>Select a conversation to start messaging.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HireChats({ embedded = false }) {
  if (embedded) {
    return (
      <div className="p-6">
        <ChatPanel />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <section className="container mx-auto px-4 py-8">
        <ChatPanel />
      </section>
      <Footer />
    </div>
  );
}
