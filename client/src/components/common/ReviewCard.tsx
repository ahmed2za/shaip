import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import Image from 'next/image';
import { ThumbUpIcon, ThumbDownIcon, FlagIcon } from '@heroicons/react/outline';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: {
    id: string;
    title: string;
    content: string;
    rating: number;
    createdAt: string;
    helpful: number;
    notHelpful: number;
    user: {
      name: string;
      image?: string;
      reviewCount: number;
    };
    company: {
      name: string;
      logo: string;
    };
  };
  showCompany?: boolean;
}

export default function ReviewCard({ review, showCompany = true }: ReviewCardProps) {
  const formattedDate = format(new Date(review.createdAt), 'dd MMMM yyyy', { locale: ar });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="relative h-12 w-12">
            {review.user.image ? (
              <Image
                src={review.user.image}
                alt={review.user.name}
                layout="fill"
                className="rounded-full"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 text-lg font-semibold">
                  {review.user.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{review.user.name}</h4>
            <p className="text-sm text-gray-500">
              {review.user.reviewCount} تقييم
            </p>
          </div>
        </div>

        {showCompany && (
          <div className="flex items-center">
            <div className="relative h-8 w-8 ml-2">
              <Image
                src={review.company.logo}
                alt={review.company.name}
                layout="fill"
                className="rounded"
              />
            </div>
            <span className="text-sm text-gray-600">{review.company.name}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center">
          <StarRating rating={review.rating} />
          <span className="mr-2 text-sm text-gray-600">{formattedDate}</span>
        </div>
        <h3 className="mt-2 text-lg font-medium text-gray-900">{review.title}</h3>
        <p className="mt-2 text-gray-600 whitespace-pre-line">{review.content}</p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-6 space-x-reverse">
          <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ThumbUpIcon className="h-5 w-5 ml-1" />
            <span>مفيد ({review.helpful})</span>
          </button>
          <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ThumbDownIcon className="h-5 w-5 ml-1" />
            <span>غير مفيد ({review.notHelpful})</span>
          </button>
        </div>
        <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          <FlagIcon className="h-5 w-5 ml-1" />
          <span>إبلاغ</span>
        </button>
      </div>
    </div>
  );
}
