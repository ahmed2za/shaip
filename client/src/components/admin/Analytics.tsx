import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { ar } from 'date-fns/locale';
import { defaultLineChartOptions, defaultBarChartOptions } from '@/utils/chartConfig';

interface AnalyticsData {
  userGrowth: {
    dates: string[];
    counts: number[];
  };
  reviewActivity: {
    dates: string[];
    reviews: number[];
    responses: number[];
  };
  categoryDistribution: {
    labels: string[];
    data: number[];
  };
  companyStats: {
    total: number;
    active: number;
    verified: number;
    pending: number;
  };
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?days=${timeRange}`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !analyticsData) {
    return <div>جاري تحميل البيانات...</div>;
  }

  const userGrowthOptions = {
    ...defaultLineChartOptions,
    plugins: {
      title: {
        display: true,
        text: 'نمو المستخدمين',
      },
    },
  };

  const userGrowthData = {
    labels: analyticsData.userGrowth.dates.map((date) =>
      format(new Date(date), 'dd MMM', { locale: ar })
    ),
    datasets: [
      {
        label: 'عدد المستخدمين',
        data: analyticsData.userGrowth.counts,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const reviewActivityData = {
    labels: analyticsData.reviewActivity.dates.map((date) =>
      format(new Date(date), 'dd MMM', { locale: ar })
    ),
    datasets: [
      {
        label: 'المراجعات',
        data: analyticsData.reviewActivity.reviews,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'الردود',
        data: analyticsData.reviewActivity.responses,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const categoryDistributionData = {
    labels: analyticsData.categoryDistribution.labels,
    datasets: [
      {
        data: analyticsData.categoryDistribution.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">تحليلات النظام</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="7">آخر 7 أيام</option>
          <option value="30">آخر 30 يوم</option>
          <option value="90">آخر 90 يوم</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">إجمالي الشركات</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {analyticsData.companyStats.total}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">الشركات النشطة</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {analyticsData.companyStats.active}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">الشركات الموثقة</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {analyticsData.companyStats.verified}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">قيد المراجعة</h3>
          <p className="mt-2 text-3xl font-bold text-gray-600">
            {analyticsData.companyStats.pending}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <Line options={userGrowthOptions} data={userGrowthData} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <Bar
            options={{
              ...defaultBarChartOptions,
              plugins: {
                title: {
                  display: true,
                  text: 'نشاط المراجعات',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
            data={reviewActivityData}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <Doughnut
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                title: {
                  display: true,
                  text: 'توزيع الفئات',
                },
                legend: {
                  position: 'bottom' as const,
                }
              }
            }}
            data={categoryDistributionData}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            إحصائيات سريعة
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">معدل الاستجابة</span>
                <span className="font-medium">
                  {(
                    (analyticsData.reviewActivity.responses.reduce(
                      (a, b) => a + b,
                      0
                    ) /
                      analyticsData.reviewActivity.reviews.reduce(
                        (a, b) => a + b,
                        0
                      )) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{
                    width: `${
                      (analyticsData.reviewActivity.responses.reduce(
                        (a, b) => a + b,
                        0
                      ) /
                        analyticsData.reviewActivity.reviews.reduce(
                          (a, b) => a + b,
                          0
                        )) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">معدل التوثيق</span>
                <span className="font-medium">
                  {(
                    (analyticsData.companyStats.verified /
                      analyticsData.companyStats.total) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-yellow-600 rounded-full"
                  style={{
                    width: `${
                      (analyticsData.companyStats.verified /
                        analyticsData.companyStats.total) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
