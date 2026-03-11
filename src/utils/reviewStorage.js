const REVIEWS_KEY = 'customer_reviews';
const REVIEWS_UPDATED_EVENT = 'hamro_reviews_updated';
const REVIEW_LIKED_KEY = 'customer_review_liked_map';

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

function readLikedMap() {
  try {
    const raw = localStorage.getItem(REVIEW_LIKED_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeLikedMap(map) {
  localStorage.setItem(REVIEW_LIKED_KEY, JSON.stringify(map));
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
    likes: Number(review.likes) || 0,
    vehicleName: review.vehicleName || '',
    createdAt: review.createdAt || new Date().toISOString(),
  };

  const nextReviews = [nextReview, ...reviews].slice(0, 30);
  writeReviews(nextReviews);
  return nextReview;
}

export function updateStoredReview(reviewId, updates = {}) {
  const reviews = readReviews();
  const nextReviews = reviews.map((review) => {
    if (review.id !== reviewId) return review;

    const nextRating = updates.rating === undefined ? review.rating : normalizeRating(updates.rating);
    const nextContent = updates.content === undefined ? review.content : String(updates.content || '').trim();

    return {
      ...review,
      rating: nextRating,
      content: nextContent || review.content,
      updatedAt: new Date().toISOString(),
    };
  });

  writeReviews(nextReviews);
  return nextReviews.find((review) => review.id === reviewId) || null;
}

export function deleteStoredReview(reviewId) {
  const reviews = readReviews();
  const nextReviews = reviews.filter((review) => review.id !== reviewId);

  if (nextReviews.length === reviews.length) return false;

  writeReviews(nextReviews);
  return true;
}

export function isReviewLiked(reviewId) {
  if (!reviewId) return false;
  const likedMap = readLikedMap();
  return Boolean(likedMap[reviewId]);
}

export function toggleReviewLike(reviewId) {
  if (!reviewId) {
    return { liked: false, likes: 0 };
  }

  const likedMap = readLikedMap();
  const wasLiked = Boolean(likedMap[reviewId]);
  const nextLiked = !wasLiked;

  if (nextLiked) {
    likedMap[reviewId] = true;
  } else {
    delete likedMap[reviewId];
  }
  writeLikedMap(likedMap);

  const reviews = readReviews();
  let nextLikes = 0;
  let found = false;

  const nextReviews = reviews.map((review) => {
    if (review.id !== reviewId) return review;

    found = true;
    const currentLikes = Math.max(0, Number(review.likes) || 0);
    nextLikes = nextLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);

    return {
      ...review,
      likes: nextLikes,
      updatedAt: new Date().toISOString(),
    };
  });

  if (found) {
    writeReviews(nextReviews);
  } else {
    window.dispatchEvent(new Event(REVIEWS_UPDATED_EVENT));
  }

  return { liked: nextLiked, likes: nextLikes };
}

export const reviewStorageEvents = {
  REVIEWS_UPDATED_EVENT,
};
