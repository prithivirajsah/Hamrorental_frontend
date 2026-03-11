import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Heart, MessageSquareText, Pencil, Trash2, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RatingDisplay, RatingInput } from '../components/ui/rating';
import api from '../api';
import { toast } from 'react-toastify';

const REVIEW_LIKED_KEY = 'customer_review_liked_map';

const readLikedMap = () => {
  try {
    const raw = localStorage.getItem(REVIEW_LIKED_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeLikedMap = (map) => {
  localStorage.setItem(REVIEW_LIKED_KEY, JSON.stringify(map));
};

const isReviewLiked = (reviewId) => {
  if (!reviewId) return false;
  const likedMap = readLikedMap();
  return Boolean(likedMap[reviewId]);
};

const setReviewLiked = (reviewId, liked) => {
  const likedMap = readLikedMap();
  if (liked) {
    likedMap[reviewId] = true;
  } else {
    delete likedMap[reviewId];
  }
  writeLikedMap(likedMap);
};

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [draftRating, setDraftRating] = useState(0);
  const [draftContent, setDraftContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      setLoading(true);
      try {
        const data = await api.getMyReviews({ limit: 100 });
        if (isMounted) {
          setReviews(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to load reviews:', error);
        if (isMounted) {
          setReviews([]);
          toast.error('Unable to fetch your reviews.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const myReviews = useMemo(() => reviews, [reviews]);

  const averageRating = useMemo(() => {
    if (!myReviews.length) return 0;
    const total = myReviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0);
    return total / myReviews.length;
  }, [myReviews]);

  const handleStartEdit = (review) => {
    setEditingId(review.id);
    setDraftRating(Number(review.rating) || 1);
    setDraftContent(review.content || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDraftRating(0);
    setDraftContent('');
  };

  const handleSaveEdit = async (reviewId) => {
    const content = draftContent.trim();
    if (!draftRating || !content) return;

    try {
      const updated = await api.updateReview(reviewId, {
        rating: draftRating,
        content,
      });

      setReviews((prev) => prev.map((review) => (review.id === reviewId ? updated : review)));
      handleCancelEdit();
      toast.success('Review updated.');
    } catch (error) {
      const detail = error?.response?.data?.detail;
      toast.error(detail || 'Unable to update review.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.deleteReview(reviewId);
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      if (editingId === reviewId) {
        handleCancelEdit();
      }
      toast.success('Review deleted.');
    } catch (error) {
      const detail = error?.response?.data?.detail;
      toast.error(detail || 'Unable to delete review.');
    }
  };

  const handleToggleLike = async (reviewId) => {
    const currentlyLiked = isReviewLiked(reviewId);
    const nextLiked = !currentlyLiked;
    const delta = nextLiked ? 1 : -1;

    try {
      const updated = await api.updateReviewLikes(reviewId, delta);
      setReviewLiked(reviewId, nextLiked);
      setReviews((prev) => prev.map((review) => (review.id === reviewId ? updated : review)));
    } catch (error) {
      const detail = error?.response?.data?.detail;
      toast.error(detail || 'Unable to update like status.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F2F2] text-black">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">My Reviews</h1>
            <p className="text-gray-600 mt-1">See all feedback you have shared.</p>
          </div>
          <Link
            to="/vehicles"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-medium transition-colors"
          >
            Explore Vehicles
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Total Reviews</p>
            <p className="text-2xl font-bold mt-1">{myReviews.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Average Rating</p>
            <div className="mt-1">
              <RatingDisplay value={averageRating} showValue valueClassName="font-semibold" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Latest Review</p>
            <p className="text-base font-semibold mt-1">{myReviews[0] ? formatDate(myReviews[0].created_at || myReviews[0].createdAt) : '—'}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading your reviews...</div>
          ) : myReviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquareText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-700">No reviews yet</h2>
              <p className="text-gray-500 mt-1 mb-5">After rating a vehicle, your review will appear here.</p>
              <Link
                to="/vehicles"
                className="inline-flex items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-medium transition-colors"
              >
                Rate a Vehicle
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myReviews.map((review) => (
                <article key={review.id} className="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{review.vehicle_name || review.vehicleName || 'Vehicle Review'}</h3>
                      <p className="text-sm text-gray-500">{review.role || 'Customer'}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      {editingId === review.id ? (
                        <RatingInput value={draftRating} onChange={setDraftRating} size="sm" />
                      ) : (
                        <RatingDisplay value={review.rating} showValue size="sm" valueClassName="font-medium" />
                      )}
                      <p className="text-xs text-gray-500 mt-1">{formatDate(review.created_at || review.createdAt)}</p>
                    </div>
                  </div>

                  {editingId === review.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={draftContent}
                        onChange={(event) => setDraftContent(event.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Update your review"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(review.id)}
                          disabled={!draftRating || !draftContent.trim()}
                          className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-3 py-1.5 text-sm font-medium transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-1.5 text-sm font-medium transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-700 leading-relaxed">{review.content}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleLike(review.id)}
                          className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                            isReviewLiked(review.id)
                              ? 'border-pink-200 bg-pink-50 text-pink-600'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isReviewLiked(review.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
                          {isReviewLiked(review.id) ? 'Liked' : 'Like'} ({Number(review.likes) || 0})
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(review)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-1.5 text-sm font-medium transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(review.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 px-3 py-1.5 text-sm font-medium transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}