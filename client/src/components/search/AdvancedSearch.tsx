import { useState } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface SearchFilters {
  category: string;
  rating: string;
  location: string;
  sortBy: string;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
}

export default function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    rating: '',
    location: '',
    sortBy: 'rating'
  });

  const categories = [
    'الكل',
    'تقنية المعلومات',
    'اتصالات',
    'خدمات مالية',
    'تجارة إلكترونية',
    'صناعة',
    'خدمات لوجستية'
  ];

  const locations = [
    'الكل',
    'الرياض',
    'جدة',
    'الدمام',
    'مكة المكرمة',
    'المدينة المنورة'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
      <form onSubmit={handleSearch}>
        <div className="flex items-center">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pr-10"
              placeholder="ابحث عن شركة..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="mr-4 p-2 text-gray-400 hover:text-gray-500"
            onClick={() => setShowFilters(!showFilters)}
          >
            <AdjustmentsHorizontalIcon className="h-6 w-6" />
          </button>
          <button type="submit" className="btn btn-primary mr-4">
            بحث
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                التصنيف
              </label>
              <select
                id="category"
                className="mt-1 form-input"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                التقييم
              </label>
              <select
                id="rating"
                className="mt-1 form-input"
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <option value="">الكل</option>
                <option value="4">4 نجوم وأعلى</option>
                <option value="3">3 نجوم وأعلى</option>
                <option value="2">2 نجوم وأعلى</option>
                <option value="1">نجمة وأعلى</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                المدينة
              </label>
              <select
                id="location"
                className="mt-1 form-input"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">
                ترتيب حسب
              </label>
              <select
                id="sortBy"
                className="mt-1 form-input"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="rating">التقييم الأعلى</option>
                <option value="reviews">عدد التقييمات</option>
                <option value="name">الاسم</option>
                <option value="recent">الأحدث</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
