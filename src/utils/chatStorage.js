const DRIVER_CHAT_THREADS_KEY = 'driver_hire_chat_threads';
const DRIVER_CHAT_UPDATED_EVENT = 'hamro_driver_chat_updated';

function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function safeTrim(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function readThreads() {
  try {
    const raw = localStorage.getItem(DRIVER_CHAT_THREADS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeThreads(threads) {
  localStorage.setItem(DRIVER_CHAT_THREADS_KEY, JSON.stringify(threads));
  window.dispatchEvent(new Event(DRIVER_CHAT_UPDATED_EVENT));
}

function toIdentity(user, fallbackRole = 'user') {
  if (!user) {
    return {
      id: null,
      role: fallbackRole,
      name: 'Unknown user',
      email: '',
    };
  }

  return {
    id: String(user.id ?? user.user_id ?? user.email ?? user.username ?? generateId('anon')),
    role: user.role || fallbackRole,
    name: user.full_name || user.username || user.email || 'Unknown user',
    email: user.email || '',
  };
}

function makeParticipant(identity) {
  return {
    user_id: identity.id,
    role: identity.role,
    name: identity.name,
    email: identity.email,
  };
}

function hasAccess(thread, identity) {
  if (!thread || !identity) return false;
  if (identity.role === 'admin') return true;
  return thread.participants?.some((participant) => participant.user_id === identity.id);
}

export function getChatThreads() {
  return readThreads().sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

export function getChatThreadById(threadId) {
  return readThreads().find((thread) => thread.id === threadId) || null;
}

export function getChatThreadsForUser(user) {
  const identity = toIdentity(user);
  const threads = getChatThreads();

  if (identity.role === 'admin') return threads;
  return threads.filter((thread) => hasAccess(thread, identity));
}

export function ensureDriverRequestChatThread(request, driverUser) {
  if (!request?.id || !request.customer_user_id || !driverUser) {
    return null;
  }

  const customerIdentity = {
    id: String(request.customer_user_id),
    role: 'user',
    name: request.customer_name || 'Customer',
    email: request.customer_email || '',
  };

  const driverIdentity = toIdentity(driverUser, 'driver');

  const existingThreads = readThreads();
  const existing = existingThreads.find((thread) => thread.request_id === request.id);

  if (existing) {
    const participantIds = new Set((existing.participants || []).map((item) => item.user_id));
    const nextParticipants = [...(existing.participants || [])];

    if (!participantIds.has(customerIdentity.id)) {
      nextParticipants.push(makeParticipant(customerIdentity));
    }
    if (!participantIds.has(driverIdentity.id)) {
      nextParticipants.push(makeParticipant(driverIdentity));
    }

    const updatedExisting = {
      ...existing,
      participants: nextParticipants,
      updated_at: new Date().toISOString(),
    };

    const nextThreads = existingThreads.map((thread) => {
      if (thread.id !== existing.id) return thread;
      return updatedExisting;
    });

    writeThreads(nextThreads);
    return updatedExisting;
  }

  const createdAt = new Date().toISOString();
  const welcomeMessage = {
    id: generateId('msg'),
    sender_user_id: 'system',
    sender_role: 'system',
    sender_name: 'System',
    message: `${driverIdentity.name} has accepted this hire request. You can chat here now.`,
    created_at: createdAt,
  };

  const nextThread = {
    id: generateId('thread'),
    request_id: request.id,
    title: `Hire request for ${request.pickup_location || 'trip'}`,
    context: {
      service_type: request.service_type || 'Driver Hire',
      pickup_location: request.pickup_location || '',
      pickup_date: request.pickup_date || '',
      pickup_time: request.pickup_time || '',
    },
    participants: [makeParticipant(customerIdentity), makeParticipant(driverIdentity)],
    messages: [welcomeMessage],
    status: 'active',
    created_at: createdAt,
    updated_at: createdAt,
  };

  const nextThreads = [nextThread, ...existingThreads].slice(0, 500);
  writeThreads(nextThreads);
  return nextThread;
}

export function sendChatMessage({ threadId, senderUser, message }) {
  const text = safeTrim(message);
  if (!threadId || !text) return null;

  const identity = toIdentity(senderUser);
  const threads = readThreads();
  const index = threads.findIndex((thread) => thread.id === threadId);

  if (index === -1) return null;

  const thread = threads[index];
  if (!hasAccess(thread, identity)) {
    return null;
  }

  const nextMessage = {
    id: generateId('msg'),
    sender_user_id: identity.id,
    sender_role: identity.role,
    sender_name: identity.name,
    message: text,
    created_at: new Date().toISOString(),
  };

  const nextThread = {
    ...thread,
    messages: [...(thread.messages || []), nextMessage],
    updated_at: new Date().toISOString(),
  };

  const nextThreads = [...threads];
  nextThreads[index] = nextThread;
  writeThreads(nextThreads);

  return nextMessage;
}

export const driverChatStorageEvents = {
  DRIVER_CHAT_UPDATED_EVENT,
};
