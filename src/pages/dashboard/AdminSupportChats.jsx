import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, MessageCircleMore, Send, Users } from 'lucide-react';
import api from '@/api';

const POLL_INTERVAL_MS = 4000;

const formatDateTime = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleString();
};

export default function AdminSupportChats() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const selectedConversation = useMemo(
    () => conversations.find((item) => item.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const refreshConversations = async (preserveSelection = true) => {
    const data = await api.getAdminSupportConversations();
    const list = Array.isArray(data) ? data : [];
    setConversations(list);

    if (list.length === 0) {
      setSelectedConversationId(null);
      setMessages([]);
      return;
    }

    if (preserveSelection && list.some((item) => item.id === selectedConversationId)) {
      return;
    }

    setSelectedConversationId(list[0].id);
  };

  const refreshMessages = async (conversationId, markAsRead = true) => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    try {
      const data = await api.getAdminSupportConversationMessages(conversationId);
      setMessages(Array.isArray(data) ? data : []);
      if (markAsRead) {
        await api.markAdminSupportConversationRead(conversationId);
      }
    } finally {
      setLoadingMessages(false);
    }
  };

  const loadInitial = async () => {
    setLoadingConversations(true);
    setError('');
    try {
      await refreshConversations(false);
    } catch (loadError) {
      setError(loadError?.response?.data?.detail || 'Unable to load support conversations.');
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    loadInitial();
  }, []);

  useEffect(() => {
    if (!selectedConversationId) return;

    let active = true;
    const load = async () => {
      try {
        await refreshMessages(selectedConversationId, true);
        await refreshConversations(true);
      } catch (loadError) {
        if (active) {
          setError(loadError?.response?.data?.detail || 'Unable to load messages.');
        }
      }
    };

    load();
    const intervalId = window.setInterval(load, POLL_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [selectedConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!selectedConversationId || !messageInput.trim()) return;

    setSending(true);
    setError('');
    try {
      await api.sendAdminSupportConversationMessage(selectedConversationId, {
        message: messageInput,
      });
      setMessageInput('');
      await refreshMessages(selectedConversationId, false);
      await refreshConversations(true);
    } catch (sendError) {
      setError(sendError?.response?.data?.detail || 'Unable to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Chat Inbox</h1>
          <p className="text-sm text-gray-500">View all user support conversations and reply in real time.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          {conversations.length} conversation{conversations.length === 1 ? '' : 's'}
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">User Conversations</p>
          </div>

          <div className="max-h-[640px] overflow-y-auto divide-y divide-gray-100">
            {loadingConversations ? (
              <div className="px-4 py-6 text-sm text-gray-500">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="px-4 py-8 text-sm text-gray-500 text-center">No support conversation found.</div>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    selectedConversationId === conversation.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-900 truncate">{conversation.user_name || conversation.user_email || `User #${conversation.user_id}`}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">{conversation.last_message?.message || 'No message yet'}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-[11px] text-gray-400">{formatDateTime(conversation.updated_at)}</p>
                    {conversation.unread_count_for_admin > 0 ? (
                      <span className="text-[11px] font-semibold rounded-full bg-red-100 text-red-700 px-2 py-0.5">
                        {conversation.unread_count_for_admin} unread
                      </span>
                    ) : null}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col min-h-[640px]">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-center p-6">
              <div>
                <MessageCircleMore className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p>Select a user conversation to start replying.</p>
              </div>
            </div>
          ) : (
            <>
              <header className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">{selectedConversation.user_name || selectedConversation.user_email || `User #${selectedConversation.user_id}`}</h2>
                <p className="text-xs text-gray-500 mt-1">Conversation #{selectedConversation.id}</p>
              </header>

              <div className="flex-1 p-4 bg-gray-50 overflow-y-auto space-y-3">
                {loadingMessages ? (
                  <div className="text-sm text-gray-500">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <MessageCircleMore className="w-9 h-9 mx-auto mb-2 text-gray-300" />
                    <p>No messages yet.</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isAdminSender = message.sender_role === 'admin';
                    return (
                      <div key={message.id} className={`flex ${isAdminSender ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                            isAdminSender
                              ? 'bg-slate-800 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          <p className="text-xs opacity-80 mb-1">{isAdminSender ? 'Admin' : message.sender_name || 'User'}</p>
                          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                          <div className="flex items-center justify-between gap-3 mt-1">
                            <p className={`text-[11px] ${isAdminSender ? 'text-slate-200' : 'text-gray-400'}`}>
                              {formatDateTime(message.created_at)}
                            </p>
                            {isAdminSender ? (
                              <p className={`text-[11px] ${message.is_read ? 'text-emerald-200' : 'text-slate-200'}`}>
                                {message.is_read ? 'Read' : 'Sent'}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="border-t border-gray-100 p-3 flex items-center gap-2">
                <input
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  placeholder="Reply to user"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !messageInput.trim()}
                  className="inline-flex items-center gap-1 rounded-lg px-4 py-2 bg-slate-800 text-white text-sm font-medium hover:bg-slate-900 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
