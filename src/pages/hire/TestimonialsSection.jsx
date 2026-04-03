import React, { useEffect, useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import { RatingDisplay } from '../../components/ui/rating';
import api from '../../api';

const REVIEW_SYNC_EVENT = 'hamro_reviews_api_updated';
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

export default function TestimonialsSection() {
  const [storedReviews, setStoredReviews] = useState([]);
  const [likedMap, setLikedMap] = useState(() => readLikedMap());

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await api.getReviews({ limit: 6 });
        const normalized = (Array.isArray(data) ? data : [])
          .map((review) => ({
            id: review.id,
            name: review.user_name || 'Guest User',
            role: review.role || 'Verified Renter',
            image: '',
            content: review.content || '',
            rating: Number(review.rating) || 0,
            likes: Number(review.likes) || 0,
            vehicleName: review.vehicle_name || '',
            createdAt: review.created_at || review.createdAt || null,
          }))
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 6);

        setStoredReviews(normalized);
      } catch {
        setStoredReviews([]);
      }

      setLikedMap(readLikedMap());
    };

    loadReviews();
    window.addEventListener('storage', loadReviews);
    window.addEventListener(REVIEW_SYNC_EVENT, loadReviews);

    return () => {
      window.removeEventListener('storage', loadReviews);
      window.removeEventListener(REVIEW_SYNC_EVENT, loadReviews);
    };
  }, []);

  const testimonials = useMemo(() => {
    return storedReviews.map((review) => ({
      ...review,
      content: review.vehicleName ? `${review.content} (${review.vehicleName})` : review.content,
    }));
  }, [storedReviews]);

  const isReviewLiked = (reviewId) => Boolean(likedMap[reviewId]);

  const handleToggleLike = async (reviewId) => {
    const currentlyLiked = isReviewLiked(reviewId);
    const nextLiked = !currentlyLiked;
    const delta = nextLiked ? 1 : -1;

    try {
      const updated = await api.updateReviewLikes(reviewId, delta);

      setStoredReviews((prev) => prev.map((review) => (
        review.id === reviewId
          ? { ...review, likes: Number(updated?.likes) || 0 }
          : review
      )));

      const nextMap = { ...likedMap };
      if (nextLiked) {
        nextMap[reviewId] = true;
      } else {
        delete nextMap[reviewId];
      }

      setLikedMap(nextMap);
      writeLikedMap(nextMap);
    } catch {
      // no-op
    }
  };

  return (
    <section className="py-15 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            What Our Customers <span className="text-[#b4aeee]">Say</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Don't just take our word for it. Here's what our happy customers have to say.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
              No reviews yet. Be the first to share your experience.
            </div>
          ) : testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id || `${testimonial.name}-${index}`}
                className="relative bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
              >

                <RatingDisplay
                  value={testimonial.rating}
                  className="mb-6"
                  valueClassName="text-slate-600"
                  showValue
                />

                <p className="text-slate-600 mb-6 leading-relaxed">"{testimonial.content}"</p>

                {testimonial.createdAt ? (
                  <button
                    type="button"
                    onClick={() => handleToggleLike(testimonial.id)}
                    className={`mb-4 inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      isReviewLiked(testimonial.id)
                        ? 'border-pink-200 bg-pink-50 text-pink-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isReviewLiked(testimonial.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
                    {isReviewLiked(testimonial.id) ? 'Liked' : 'Like'} ({Number(testimonial.likes) || 0})
                  </button>
                ) : null}

                <div>
                  <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
