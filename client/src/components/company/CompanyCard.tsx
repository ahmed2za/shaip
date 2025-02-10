import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RatingStars from './RatingStars';

interface CompanyProps {
  company: {
    id: string;
    name: string;
    description: string;
    logo: string;
    rating: number;
    reviewsCount: number;
    claimed: boolean;
    location: string;
    replyRate: number;
    replyTime: string;
    lastReviewDate: string;
  };
}

const CompanyCard: React.FC<CompanyProps> = ({ company }) => {
  // تنسيق التاريخ بشكل ثابت للتأكد من تطابق العرض بين الخادم والعميل
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      calendar: 'gregory', // استخدام التقويم الميلادي
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  return (
    <Link href={`/companies/${company.id}`}>
      <a className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="flex-shrink-0">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                {company.logo ? (
                  <Image
                    src={company.logo}
                    alt={company.name}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-xl font-semibold">
                    {company.name[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {company.name}
                </h3>
                {company.claimed && (
                  <svg
                    className="mr-2 h-5 w-5 text-primary-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              <p className="mt-1 text-sm text-gray-500 truncate">{company.location}</p>

              <div className="mt-2">
                <RatingStars
                  rating={company.rating}
                  totalReviews={company.reviewsCount}
                  size="sm"
                />
              </div>

              <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                {company.description}
              </p>

              <div className="mt-4 text-sm text-gray-500">
                آخر تقييم: {formatDate(company.lastReviewDate)}
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default CompanyCard;
