import { useMemo } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

interface CompanyStatsProps {
  ratings: {
    rating: number;
    count: number;
  }[];
  totalReviews: number;
  averageRating: number;
}

export default function CompanyStats({ ratings, totalReviews, averageRating }: CompanyStatsProps) {
  const sortedRatings = useMemo(() => {
    return [...ratings].sort((a, b) => b.rating - a.rating);
  }, [ratings]);

  const getPercentage = (count: number) => {
    return ((count / totalReviews) * 100).toFixed(1);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-500';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="text-center lg:text-right">
          <h3 className="text-xl font-medium text-gray-900">التقييم العام</h3>
          <div className="mt-4 flex items-center justify-center lg:justify-end">
            <span className={`text-5xl font-bold ${getRatingColor(averageRating)}`}>
              {averageRating.toFixed(1)}
            </span>
            <StarIcon className="h-8 w-8 text-yellow-400 mr-2" />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            بناءً على {totalReviews} تقييم
          </p>
        </div>

        {/* Rating Distribution */}
        <div>
          <h3 className="text-xl font-medium text-gray-900 mb-4">توزيع التقييمات</h3>
          <div className="space-y-3">
            {sortedRatings.map(({ rating, count }) => (
              <div key={rating} className="flex items-center">
                <div className="w-16 text-sm text-gray-600">
                  {rating} {rating === 5 ? 'نجوم' : 'نجمة'}
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${getRatingColor(rating)}`}
                      style={{ width: `${getPercentage(count)}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-600 text-left">
                  {getPercentage(count)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rating Summary */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {((ratings.filter(r => r.rating >= 4).reduce((acc, r) => acc + r.count, 0) / totalReviews) * 100).toFixed(1)}%
          </div>
          <div className="mt-1 text-sm text-gray-600">تقييمات إيجابية</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-500">
            {((ratings.filter(r => r.rating === 3).reduce((acc, r) => acc + r.count, 0) / totalReviews) * 100).toFixed(1)}%
          </div>
          <div className="mt-1 text-sm text-gray-600">تقييمات محايدة</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {((ratings.filter(r => r.rating <= 2).reduce((acc, r) => acc + r.count, 0) / totalReviews) * 100).toFixed(1)}%
          </div>
          <div className="mt-1 text-sm text-gray-600">تقييمات سلبية</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {totalReviews}
          </div>
          <div className="mt-1 text-sm text-gray-600">إجمالي التقييمات</div>
        </div>
      </div>
    </div>
  );
}
