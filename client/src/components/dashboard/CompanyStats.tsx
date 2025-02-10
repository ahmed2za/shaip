import { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { defaultChartOptions } from '@/utils/chartConfig';

interface CompanyStatsProps {
  company: {
    rating: number;
    totalReviews: number;
    responseRate: number;
    averageResponseTime: number;
  };
}

export default function CompanyStats({ company }: CompanyStatsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Mock data - replace with real API data
  const reviewsData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: 'عدد التقييمات',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const ratingDistribution = {
    labels: ['5 نجوم', '4 نجوم', '3 نجوم', 'نجمتان', 'نجمة واحدة'],
    datasets: [
      {
        label: 'توزيع التقييمات',
        data: [65, 20, 10, 3, 2],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(234, 179, 8, 0.5)',
          'rgba(249, 115, 22, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(234, 179, 8)',
          'rgb(249, 115, 22)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">
              التقييم العام
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {company.rating.toFixed(1)}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">
              إجمالي التقييمات
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {company.totalReviews}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">
              معدل الرد
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {company.responseRate}%
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">
              متوسط وقت الرد
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {company.averageResponseTime}h
            </dd>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-end space-x-2 space-x-reverse">
        <button
          onClick={() => setTimeRange('week')}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            timeRange === 'week'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          أسبوع
        </button>
        <button
          onClick={() => setTimeRange('month')}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            timeRange === 'month'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          شهر
        </button>
        <button
          onClick={() => setTimeRange('year')}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            timeRange === 'year'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          سنة
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            تطور التقييمات
          </h3>
          <Line options={defaultChartOptions} data={reviewsData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            توزيع التقييمات
          </h3>
          <Bar options={defaultChartOptions} data={ratingDistribution} />
        </div>
      </div>
    </div>
  );
}
