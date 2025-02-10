import { useState } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import StarRating from '@/components/common/StarRating';

interface Review {
  id: number;
  title: string;
  content: string;
  rating: number;
  createdAt: string;
  user: {
    name: string;
    avatar: string;
  };
  response?: {
    content: string;
    createdAt: string;
  };
}

interface ReviewsListProps {
  reviews: Review[];
}

export default function ReviewsList({ reviews: initialReviews }: ReviewsListProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState<'all' | 'responded' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [loading, setLoading] = useState(false);

  const handleResponseSubmit = async (reviewId: number, response: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: response }),
      });

      if (!res.ok) {
        throw new Error('فشل إرسال الرد');
      }

      const updatedReview = await res.json();
      setReviews(prev =>
        prev.map(review =>
          review.id === reviewId ? { ...review, response: updatedReview.response } : review
        )
      );
    } catch (error) {
      console.error('Error responding to review:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    switch (filter) {
      case 'responded':
        return !!review.response;
      case 'pending':
        return !review.response;
      default:
        return true;
    }
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.rating - a.rating;
    }
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="all">جميع التقييمات</option>
            <option value="responded">تم الرد</option>
            <option value="pending">في انتظار الرد</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="date">الأحدث</option>
            <option value="rating">الأعلى تقييماً</option>
          </select>
        </div>

        <p className="text-sm text-gray-500">
          {filteredReviews.length} تقييم
        </p>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg shadow-sm p-6 space-y-4"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 space-x-reverse">
                <img
                  src={review.user.avatar}
                  alt={review.user.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {review.user.name}
                  </h3>
                  <time
                    dateTime={review.createdAt}
                    className="text-sm text-gray-500"
                  >
                    {format(new Date(review.createdAt), 'dd MMMM yyyy', {
                      locale: ar,
                    })}
                  </time>
                </div>
              </div>
              <StarRating rating={review.rating} size="sm" />
            </div>

            {/* Review Content */}
            <div>
              <h4 className="text-base font-medium text-gray-900">
                {review.title}
              </h4>
              <p className="mt-1 text-sm text-gray-600">{review.content}</p>
            </div>

            {/* Company Response */}
            {review.response ? (
              <div className="bg-gray-50 rounded-md p-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-500">
                      رد الشركة · {format(new Date(review.response.createdAt), 'dd MMMM yyyy', { locale: ar })}
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                      {review.response.content}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const response = (form.elements.namedItem('response') as HTMLTextAreaElement).value;
                  handleResponseSubmit(review.id, response);
                  form.reset();
                }}
                className="mt-4"
              >
                <textarea
                  name="response"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="اكتب رداً على هذا التقييم..."
                  required
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {loading ? 'جاري الإرسال...' : 'إرسال الرد'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}

        {sortedReviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد تقييمات</p>
          </div>
        )}
      </div>
    </div>
  );
}
