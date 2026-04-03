import { ensureDriverRequestChatThread } from '@/utils/chatStorage';

const DRIVER_REQUESTS_KEY = 'driver_hire_requests';
const DRIVER_REQUESTS_UPDATED_EVENT = 'hamro_driver_requests_updated';

function readRequests() {
  try {
    const raw = localStorage.getItem(DRIVER_REQUESTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRequests(requests) {
  localStorage.setItem(DRIVER_REQUESTS_KEY, JSON.stringify(requests));
  window.dispatchEvent(new Event(DRIVER_REQUESTS_UPDATED_EVENT));
}

export function getDriverRequests() {
  return readRequests().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export function addDriverRequest(payload) {
  const requests = readRequests();
  const nextRequest = {
    id: payload.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    customer_name: payload.customer_name || 'Unknown customer',
    customer_user_id: payload.customer_user_id ? String(payload.customer_user_id) : null,
    customer_email: payload.customer_email || '',
    phone: payload.phone || '',
    pickup_location: payload.pickup_location || '',
    service_type: payload.service_type || 'Hourly Hire',
    pickup_date: payload.pickup_date || '',
    pickup_time: payload.pickup_time || '',
    note: payload.note || '',
    status: payload.status || 'pending',
    created_at: payload.created_at || new Date().toISOString(),
  };

  const nextRequests = [nextRequest, ...requests].slice(0, 200);
  writeRequests(nextRequests);
  return nextRequest;
}

export function updateDriverRequestStatus(requestId, status, actorUser = null) {
  const requests = readRequests();
  let ensuredThread = null;

  const nextRequests = requests.map((request) => {
    if (request.id !== requestId) return request;

    const driverMeta = actorUser?.role === 'driver'
      ? {
          assigned_driver_id: String(actorUser.id ?? actorUser.user_id ?? ''),
          assigned_driver_name: actorUser.full_name || actorUser.username || actorUser.email || 'Driver',
          assigned_driver_email: actorUser.email || '',
        }
      : {};

    const nextRequest = {
      ...request,
      ...driverMeta,
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'confirmed' && actorUser?.role === 'driver') {
      ensuredThread = ensureDriverRequestChatThread(nextRequest, actorUser);
      if (ensuredThread?.id) {
        nextRequest.chat_thread_id = ensuredThread.id;
      }
    }

    return {
      ...nextRequest,
    };
  });

  writeRequests(nextRequests);
  return nextRequests.find((request) => request.id === requestId) || null;
}

export const driverRequestStorageEvents = {
  DRIVER_REQUESTS_UPDATED_EVENT,
};
