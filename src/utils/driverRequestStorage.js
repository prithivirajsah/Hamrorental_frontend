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

export function updateDriverRequestStatus(requestId, status) {
  const requests = readRequests();
  const nextRequests = requests.map((request) => {
    if (request.id !== requestId) return request;
    return {
      ...request,
      status,
      updated_at: new Date().toISOString(),
    };
  });

  writeRequests(nextRequests);
  return nextRequests.find((request) => request.id === requestId) || null;
}

export const driverRequestStorageEvents = {
  DRIVER_REQUESTS_UPDATED_EVENT,
};
