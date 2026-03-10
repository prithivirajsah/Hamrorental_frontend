const REVIEWS_KEY = 'customer_reviews';
const REVIEWS_UPDATED_EVENT = 'hamro_reviews_updated';

function readReviews() {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeReviews(reviews) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  window.dispatchEvent(new Event(REVIEWS_UPDATED_EVENT));
}

function normalizeRating(value) {
  const number = Number(value) || 0;
  return Math.max(1, Math.min(5, Math.round(number)));
}

export function getStoredReviews() {
  return readReviews();
}

export function addReview(review) {
  const reviews = readReviews();

  const nextReview = {
    id: review.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: review.name || 'Anonymous User',
    role: review.role || 'Customer',
    content: review.content || 'Great service and smooth experience.',
    rating: normalizeRating(review.rating),
    vehicleName: review.vehicleName || '',
    createdAt: review.createdAt || new Date().toISOString(),
  };

  const nextReviews = [nextReview, ...reviews].slice(0, 30);
  writeReviews(nextReviews);
  return nextReview;
}

export const reviewStorageEvents = {
  REVIEWS_UPDATED_EVENT,
};
