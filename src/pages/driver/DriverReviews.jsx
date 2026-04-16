import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquareText, Star } from 'lucide-react';
import api from '@/api';
import { RatingDisplay } from '@/components/ui/rating';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function DriverReviews() {
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryErrorData,
  } = useQuery({
    queryKey: ['driver', 'review-summary'],
    queryFn: () => api.getMyDriverReviewSummary(),
  });

  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
    error: reviewsErrorData,
  } = useQuery({
    queryKey: ['driver', 'received-reviews'],
    queryFn: async () => {
      const response = await api.getMyReceivedDriverReviews({ limit: 200 });
      return Array.isArray(response) ? response : [];
    },
  });

  const totalReviews = Number(summary?.total_reviews || summary?.totalReviews || 0);
  const averageRating = Number(summary?.average_rating || summary?.averageRating || 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Driver Reviews</h1>
        <p className="text-sm text-gray-500">Feedback shared by customers after completed trips.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">{summaryLoading ? '...' : totalReviews}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Average Rating</p>
          <div className="mt-1">
            <RatingDisplay value={averageRating} showValue valueClassName="font-semibold" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Latest Review</p>
          <p className="text-base font-semibold mt-1 text-gray-900">
            {reviews[0] ? formatDate(reviews[0].created_at || reviews[0].createdAt) : '—'}
          </p>
        </div>
      </div>

      {summaryError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {summaryErrorData?.response?.data?.detail || 'Unable to load review summary.'}
        </div>
      ) : null}

      <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquareText className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-semibold text-gray-900">Customer Feedback</h2>
        </div>

        {reviewsLoading ? (
          <div className="text-center py-12 text-gray-500">Loading driver reviews...</div>
        ) : reviewsError ? (
          <div className="text-center py-12 text-red-600">
            {reviewsErrorData?.response?.data?.detail || 'Unable to load driver reviews.'}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-700">No driver reviews yet</h3>
            <p className="text-gray-500 mt-1">Completed trip feedback will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article key={review.id} className="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-sm transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{review.reviewer_name || review.reviewerName || 'Customer'}</h3>
                    <p className="text-sm text-gray-500">{review.vehicle_name || review.vehicleName || 'Trip review'}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <RatingDisplay value={review.rating} showValue size="sm" valueClassName="font-medium" />
                    <p className="text-xs text-gray-500 mt-1">{formatDate(review.created_at || review.createdAt)}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.content}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
