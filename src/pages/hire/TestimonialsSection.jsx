import React, { useEffect, useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import { RatingDisplay } from '../../components/ui/rating';
import { getStoredReviews, isReviewLiked, reviewStorageEvents, toggleReviewLike } from '../../utils/reviewStorage';

const defaultTestimonials = [
  {
    id: 'default-1',
    name: 'Prithivi',
    role: 'Business Executive',
    image: '',
    content: 'Exceptional service! The driver was professional, punctual, and made my airport transfer completely stress-free. Highly recommend!',
    rating: 5
  },
  {
    id: 'default-2',
    name: 'Prithivi',
    role: 'Frequent Traveler',
    image: '',
    content: 'I use their monthly service for my business needs. The drivers are always well-mannered and know the city inside out.',
    rating: 5
  },
  {
    id: 'default-3',
    name: 'Prithivi',
    role: 'Tourist',
    image: '',
    content: 'Made our vacation so much better! Our driver was not just skilled but also acted as a wonderful guide. Great value for money.',
    rating: 5
  }
];

export default function TestimonialsSection() {
  const [storedReviews, setStoredReviews] = useState([]);

  useEffect(() => {
    const loadReviews = () => {
      const reviews = getStoredReviews()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6);
      setStoredReviews(reviews);
    };

    loadReviews();
    window.addEventListener('storage', loadReviews);
    window.addEventListener(reviewStorageEvents.REVIEWS_UPDATED_EVENT, loadReviews);

    return () => {
      window.removeEventListener('storage', loadReviews);
      window.removeEventListener(reviewStorageEvents.REVIEWS_UPDATED_EVENT, loadReviews);
    };
  }, []);

  const testimonials = useMemo(() => {
    const formattedStored = storedReviews.map((review) => ({
      ...review,
      content: review.vehicleName ? `${review.content} (${review.vehicleName})` : review.content,
    }));

    return [...formattedStored, ...defaultTestimonials].slice(0, 6);
  }, [storedReviews]);

  const handleToggleLike = (reviewId) => {
    toggleReviewLike(reviewId);
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
          {testimonials.map((testimonial, index) => (
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
