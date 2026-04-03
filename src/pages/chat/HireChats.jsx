import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Send, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import {
  driverChatStorageEvents,
  getChatThreadsForUser,
  sendChatMessage,
} from '@/utils/chatStorage';

const formatDateTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString();
};

function getCurrentUserId(user) {
  return String(user?.id ?? user?.user_id ?? user?.email ?? '');
}

function getThreadPeer(thread, currentUserId) {
  return (thread?.participants || []).find((participant) => participant.user_id !== currentUserId) || null;
}

function ChatPanel() {
  const { user } = useAuth();
  const location = useLocation();
  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const currentUserId = useMemo(() => getCurrentUserId(user), [user]);

  const refreshThreads = () => {
    const nextThreads = getChatThreadsForUser(user);
    setThreads(nextThreads);

    const queryThreadId = new URLSearchParams(location.search).get('thread');
    if (queryThreadId && nextThreads.some((thread) => thread.id === queryThreadId)) {
      setSelectedThreadId(queryThreadId);
      return;
    }

    if (!nextThreads.some((thread) => thread.id === selectedThreadId)) {
      setSelectedThreadId(nextThreads[0]?.id || '');
    }
  };

  useEffect(() => {
    refreshThreads();
    window.addEventListener(driverChatStorageEvents.DRIVER_CHAT_UPDATED_EVENT, refreshThreads);
    return () => {
      window.removeEventListener(driverChatStorageEvents.DRIVER_CHAT_UPDATED_EVENT, refreshThreads);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, location.search]);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) || null,
    [threads, selectedThreadId]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedThread?.messages?.length]);

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!selectedThreadId || !messageInput.trim()) return;

    sendChatMessage({
      threadId: selectedThreadId,
      senderUser: user,
      message: messageInput,
    });

    setMessageInput('');
    refreshThreads();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Driver Hire Chat</h1>
        <p className="text-sm text-gray-500">Message your matched driver or customer after request confirmation.</p>
      </div>

      {threads.length === 0 ? (
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-10 text-center">
          <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-700 font-medium">No active chat yet</p>
          <p className="text-sm text-gray-500 mt-1">Create a hire request and wait for driver confirmation to start chat.</p>
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
                const lastMessage = thread.messages?.[thread.messages.length - 1];
                return (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      selectedThreadId === thread.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900 truncate">{peer?.name || thread.title}</p>
                    <p className="text-xs text-gray-500 truncate mt-1">{lastMessage?.message || 'No message yet'}</p>
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
                  <p className="text-sm text-gray-500">Service: {selectedThread.context?.service_type || 'Driver Hire'}</p>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedThread.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Pickup: {selectedThread.context?.pickup_location || 'N/A'} • {selectedThread.context?.pickup_date || 'N/A'} {selectedThread.context?.pickup_time || ''}
                  </p>
                </div>

                <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
                  {(selectedThread.messages || []).map((message) => {
                    const isMine = message.sender_user_id === currentUserId;
                    const isSystem = message.sender_role === 'system';

                    if (isSystem) {
                      return (
                        <div key={message.id} className="text-center">
                          <span className="inline-flex px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                            {message.message}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${isMine ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                          <p className="text-xs opacity-80 mb-1">{isMine ? 'You' : message.sender_name}</p>
                          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                          <p className={`text-[11px] mt-1 ${isMine ? 'text-indigo-100' : 'text-gray-400'}`}>
                            {formatDateTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex items-center gap-2">
                  <input
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    placeholder="Type your message"
                  />
                  <button
                    type="submit"
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
