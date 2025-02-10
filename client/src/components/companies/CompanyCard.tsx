import Link from 'next/link';
import Image from 'next/image';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import StarRating from '../common/StarRating';

interface CompanyCardProps {
  company: {
    id: string;
    name: string;
    logo: string;
    website: string;
    description: string;
    rating: number;
    reviewCount: number;
    category: string;
    location: {
      name: string;
    };
    isVerified: boolean;
  };
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link 
      href={`/companies/${company.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="relative h-16 w-16 ml-4">
              <Image
                src={company.logo || '/images/placeholder-company.png'}
                alt={company.name}
                width={64}
                height={64}
                className="rounded-lg object-cover"
              />
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {company.name}
                </h3>
                {company.isVerified && (
                  <CheckBadgeIcon className="h-5 w-5 text-primary-600 mr-1" />
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {company.category} · {company.location.name}
              </p>
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center">
              <StarRating rating={company.rating} size="sm" />
              <span className="mr-1 text-sm text-gray-500">
                ({company.reviewCount})
              </span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600 line-clamp-2">
          {company.description}
        </p>
      </div>
    </Link>
  );
}
