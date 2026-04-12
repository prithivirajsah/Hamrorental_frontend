import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, MessageSquare, Plus, Send, ShieldAlert } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/api';

const POLL_INTERVAL_MS = 4000;

const formatDateTime = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleString();
};

function ConversationSidebar({ conversations, activeId, onSelect, onCreateNew, loadingList }) {
  return (
    <aside className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-gray-800">Conversations</p>
        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Plus className="w-3.5 h-3.5" /> New
        </button>
      </div>

      <div className="max-h-[520px] overflow-y-auto divide-y divide-gray-100">
        {loadingList ? (
          <div className="px-4 py-6 text-sm text-gray-500">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="px-4 py-8 text-sm text-gray-500 text-center">No support conversation yet.</div>
        ) : (
          conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={`w-full px-4 py-3 text-left transition-colors ${
                activeId === conversation.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm font-medium text-gray-900">Ticket #{conversation.id}</p>
              <p className="text-xs text-gray-500 mt-1 truncate">{conversation.last_message?.message || 'No message yet'}</p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[11px] text-gray-400">{formatDateTime(conversation.updated_at)}</p>
                {conversation.unread_count_for_user > 0 ? (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {conversation.unread_count_for_user} new
                  </span>
                ) : null}
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}

export default function UserSupportChat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const selectedConversation = useMemo(
    () => conversations.find((item) => item.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const ensureConversation = async (createNew = false) => {
    const conversation = await api.getOrCreateSupportConversation(createNew);
    return conversation;
  };

  const refreshConversations = async ({ keepCurrent = true } = {}) => {
    const list = await api.getMySupportConversations();
    const normalized = Array.isArray(list) ? list : [];
    setConversations(normalized);

    if (normalized.length === 0) {
      const created = await ensureConversation(false);
      setConversations(created ? [created] : []);
      setSelectedConversationId(created?.id || null);
      return;
    }

    if (keepCurrent && normalized.some((item) => item.id === selectedConversationId)) {
      return;
    }

    setSelectedConversationId(normalized[0].id);
  };

  const refreshMessages = async (conversationId, markAsRead = true) => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    try {
      const data = await api.getSupportConversationMessages(conversationId);
      setMessages(Array.isArray(data) ? data : []);

      if (markAsRead) {
        await api.markSupportConversationRead(conversationId);
      }
    } finally {
      setLoadingMessages(false);
    }
  };

  const loadInitial = async () => {
    if (!user?.id) {
      setLoadingList(false);
      return;
    }

    setLoadingList(true);
    setError('');
    try {
      await refreshConversations({ keepCurrent: false });
    } catch (loadError) {
      setError(loadError?.response?.data?.detail || 'Could not load support chat.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadInitial();
  }, [user?.id]);

  useEffect(() => {
    if (!selectedConversationId) return;

    let active = true;
    const load = async () => {
      try {
        await refreshMessages(selectedConversationId, true);
        await refreshConversations({ keepCurrent: true });
      } catch (loadError) {
        if (active) {
          setError(loadError?.response?.data?.detail || 'Could not load conversation messages.');
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
    scrollToBottom();
  }, [messages.length]);

  const handleCreateConversation = async () => {
    setError('');
    try {
      const created = await ensureConversation(true);
      if (!created?.id) return;
      await refreshConversations({ keepCurrent: false });
      setSelectedConversationId(created.id);
      setMessages([]);
    } catch (createError) {
      setError(createError?.response?.data?.detail || 'Could not create a new conversation.');
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!selectedConversationId || !messageInput.trim()) return;

    setSending(true);
    setError('');
    try {
      await api.sendSupportConversationMessage(selectedConversationId, {
        message: messageInput,
      });
      setMessageInput('');
      await refreshMessages(selectedConversationId, false);
      await refreshConversations({ keepCurrent: true });
    } catch (sendError) {
      setError(sendError?.response?.data?.detail || 'Could not send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <section className="container mx-auto px-4 py-8 space-y-6">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6" />
            <div>
              <h1 className="text-2xl font-bold">Support Chat</h1>
              <p className="text-sm text-indigo-100 mt-1">Talk with admin support. Messages are saved and visible in your chat history.</p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ConversationSidebar
            conversations={conversations}
            activeId={selectedConversationId}
            onSelect={setSelectedConversationId}
            onCreateNew={handleCreateConversation}
            loadingList={loadingList}
          />

          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col min-h-[620px]">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-center p-6">
                <div>
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p>Select a conversation or create a new one.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500">Conversation Ticket</p>
                  <h2 className="text-lg font-semibold text-gray-900">#{selectedConversation.id}</h2>
                </div>

                <div className="flex-1 p-4 bg-gray-50 overflow-y-auto space-y-3">
                  {loadingMessages ? (
                    <div className="text-sm text-gray-500">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                      <MessageSquare className="w-9 h-9 mx-auto mb-2 text-gray-300" />
                      <p>No messages yet. Start your conversation.</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isMine = Number(message.sender_id) === Number(user?.id);
                      return (
                        <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[78%] rounded-2xl px-3 py-2 ${
                              isMine
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-xs opacity-80 mb-1">{isMine ? 'You' : message.sender_name || 'Admin'}</p>
                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                            <div className="flex items-center justify-between gap-3 mt-1">
                              <p className={`text-[11px] ${isMine ? 'text-indigo-100' : 'text-gray-400'}`}>
                                {formatDateTime(message.created_at)}
                              </p>
                              {isMine ? (
                                <p className={`text-[11px] ${message.is_read ? 'text-emerald-200' : 'text-indigo-100'}`}>
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
                    placeholder="Type a message to support"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !messageInput.trim()}
                    className="inline-flex items-center gap-1 rounded-lg px-4 py-2 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" /> Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
