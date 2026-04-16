import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock3, Heart, MessageSquareText, Pencil, Star, Trash2, X } from 'lucide-react';
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
  const [reviewReminders, setReviewReminders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [draftRating, setDraftRating] = useState(0);
  const [draftContent, setDraftContent] = useState('');
  const [draftReminders, setDraftReminders] = useState({});
  const [loading, setLoading] = useState(true);
  const [remindersLoading, setRemindersLoading] = useState(true);
  const [submittingDriverReview, setSubmittingDriverReview] = useState(false);
  const [driverReviewForm, setDriverReviewForm] = useState({
    booking_id: '',
    rating: 0,
    content: '',
  });

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

    const loadReviewReminders = async () => {
      setRemindersLoading(true);
      try {
        const data = await api.getReviewReminders({ limit: 20 });
        if (isMounted) {
          setReviewReminders(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to load review reminders:', error);
        if (isMounted) {
          setReviewReminders([]);
        }
      } finally {
        if (isMounted) {
          setRemindersLoading(false);
        }
      }
    };

    loadReviewReminders();

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

  const handleReminderDraftChange = (postId, field, value) => {
    setDraftReminders((prev) => ({
      ...prev,
      [postId]: {
        ...(prev[postId] || { rating: 0, content: '' }),
        [field]: value,
      },
    }));
  };

  const handleSubmitReminderReview = async (reminder) => {
    const draft = draftReminders[reminder.post_id] || {};
    const rating = Number(draft.rating) || 0;
    const content = String(draft.content || '').trim();

    if (!rating) {
      toast.error('Please select a rating before submitting.');
      return;
    }

    try {
      await api.createReview({
        post_id: reminder.post_id,
        rating,
        content: content || `Rated ${rating} stars for ${reminder.vehicle_name || 'this vehicle'}.`,
      });

      setReviewReminders((prev) => prev.filter((item) => item.post_id !== reminder.post_id));
      setDraftReminders((prev) => {
        const next = { ...prev };
        delete next[reminder.post_id];
        return next;
      });
      setReviews((prev) => [{
        id: Date.now(),
        post_id: reminder.post_id,
        user_id: null,
        rating,
        content: content || `Rated ${rating} stars for ${reminder.vehicle_name || 'this vehicle'}.`,
        likes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vehicle_name: reminder.vehicle_name,
        role: 'Verified Renter',
      }, ...prev]);
      toast.success('Review submitted successfully.');
    } catch (error) {
      const detail = error?.response?.data?.detail;
      toast.error(detail || 'Unable to submit review.');
    }
  };

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

  const handleSubmitDriverReview = async () => {
    const bookingId = Number(driverReviewForm.booking_id) || 0;
    const rating = Number(driverReviewForm.rating) || 0;
    const content = String(driverReviewForm.content || '').trim();

    if (!bookingId) {
      toast.error('Please enter a booking id.');
      return;
    }

    if (!rating) {
      toast.error('Please select a rating for the driver.');
      return;
    }

    if (!content) {
      toast.error('Please write a short driver review.');
      return;
    }

    setSubmittingDriverReview(true);
    try {
      await api.createDriverReview({
        booking_id: bookingId,
        rating,
        content,
      });
      toast.success('Driver review submitted successfully.');
      setDriverReviewForm({ booking_id: '', rating: 0, content: '' });
    } catch (error) {
      const detail = error?.response?.data?.detail;
      toast.error(detail || 'Unable to submit driver review.');
    } finally {
      setSubmittingDriverReview(false);
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

        <div className="mb-6 rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50 p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Review reminder</p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {remindersLoading ? 'Checking completed rentals...' : reviewReminders.length > 0 ? 'You have completed rentals waiting for a review' : 'No pending reviews right now'}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {remindersLoading
                    ? 'We are loading your latest completed bookings.'
                    : reviewReminders.length > 0
                      ? 'Share your experience to help other renters choose with confidence.'
                      : 'Once a rental is marked completed, it will appear here so you can rate it quickly.'}
                </p>
              </div>
            </div>
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2 font-medium text-amber-700 transition-colors hover:bg-amber-50"
            >
              View Orders
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {reviewReminders.length > 0 ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {reviewReminders.map((reminder) => {
                const draft = draftReminders[reminder.post_id] || { rating: 0, content: '' };

                return (
                  <section key={reminder.booking_id} className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Completed trip</p>
                        <h3 className="mt-1 text-lg font-bold text-gray-900">{reminder.vehicle_name || 'Vehicle Booking'}</h3>
                        <p className="text-sm text-gray-500">
                          Booking #{reminder.booking_id} • {formatDate(reminder.start_date)} - {formatDate(reminder.end_date)}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                        Ready to review
                      </span>
                    </div>

                    <div className="mt-4 space-y-4">
                      <RatingInput
                        value={draft.rating || 0}
                        onChange={(value) => handleReminderDraftChange(reminder.post_id, 'rating', value)}
                        size="md"
                      />

                      <textarea
                        value={draft.content || ''}
                        onChange={(event) => handleReminderDraftChange(reminder.post_id, 'content', event.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                        placeholder="Write a short review about the car, driver, and experience"
                      />

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleSubmitReminderReview(reminder)}
                          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
                        >
                          Submit Review
                        </button>
                        <Link
                          to={`/vehicles/${reminder.post_id}`}
                          className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                        >
                          View vehicle
                        </Link>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="sm:col-span-3 bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Review Your Driver</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Submit driver feedback after your booking is completed. Enter your booking id and rating.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase">Booking ID</label>
                <input
                  type="number"
                  min="1"
                  value={driverReviewForm.booking_id}
                  onChange={(event) => setDriverReviewForm((prev) => ({ ...prev, booking_id: event.target.value }))}
                  placeholder="e.g. 123"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="text-xs text-gray-500 uppercase">Driver Rating</label>
                <div className="mt-2">
                  <RatingInput
                    value={driverReviewForm.rating}
                    onChange={(value) => setDriverReviewForm((prev) => ({ ...prev, rating: value }))}
                  />
                </div>
              </div>

              <div className="lg:col-span-3">
                <label className="text-xs text-gray-500 uppercase">Driver Feedback</label>
                <textarea
                  value={driverReviewForm.content}
                  onChange={(event) => setDriverReviewForm((prev) => ({ ...prev, content: event.target.value }))}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Share how the driver handled communication, safety, and punctuality"
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleSubmitDriverReview}
                disabled={submittingDriverReview}
                className="inline-flex items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 text-sm font-medium transition-colors"
              >
                {submittingDriverReview ? 'Submitting...' : 'Submit Driver Review'}
              </button>
            </div>
          </div>

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
              <p className="text-gray-500 mt-1 mb-5">Once you review a completed rental, it will appear here.</p>
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