import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Tab } from '@headlessui/react';
import {
  ChartBarIcon,
  ChatBubbleLeftIcon,
  PencilSquareIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import CompanyStats from '@/components/dashboard/CompanyStats';
import ReviewsList from '@/components/dashboard/ReviewsList';
import CompanyProfile from '@/components/dashboard/CompanyProfile';
import CompanySettings from '@/components/dashboard/CompanySettings';

interface DashboardProps {
  company: {
    id: number;
    name: string;
    logo: string;
    rating: number;
    totalReviews: number;
    responseRate: number;
    averageResponseTime: number;
  };
  reviews: Array<{
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
  }>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function CompanyDashboard({ company, reviews }: DashboardProps) {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);

  const tabs = [
    {
      name: 'الإحصائيات',
      icon: ChartBarIcon,
      component: <CompanyStats company={company} />,
    },
    {
      name: 'التقييمات',
      icon: ChatBubbleLeftIcon,
      component: <ReviewsList reviews={reviews} />,
    },
    {
      name: 'الملف التعريفي',
      icon: PencilSquareIcon,
      component: <CompanyProfile company={company} />,
    },
    {
      name: 'الإعدادات',
      icon: Cog6ToothIcon,
      component: (
        <CompanySettings
          company={{
            ...company,
            notifications: {
              email: false,
              push: false,
              reviews: false,
              messages: false,
            },
            privacy: {
              showEmail: false,
              showPhone: false,
              showLocation: false,
              showSocialMedia: false,
            },
            autoResponse: {
              enabled: false,
              message: '',
            },
          }}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Company Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={company.logo}
                alt={company.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="mr-4">
                <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                <p className="text-sm text-gray-500">
                  التقييم العام: {company.rating.toFixed(1)} ({company.totalReviews} تقييم)
                </p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">
                معدل الرد: {company.responseRate}%
              </p>
              <p className="text-sm text-gray-500">
                متوسط وقت الرد: {company.averageResponseTime} ساعة
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tab.Group onChange={setCurrentTab}>
          <div className="bg-white shadow-sm rounded-lg">
            <Tab.List className="flex p-1 space-x-1 space-x-reverse">
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full py-3 px-4 text-sm font-medium rounded-lg',
                      'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 ring-white ring-opacity-60',
                      selected
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                    )
                  }
                >
                  <div className="flex items-center justify-center">
                    <tab.icon className="h-5 w-5 ml-2" />
                    {tab.name}
                  </div>
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="p-6">
              {tabs.map((tab, index) => (
                <Tab.Panel key={index}>{tab.component}</Tab.Panel>
              ))}
            </Tab.Panels>
          </div>
        </Tab.Group>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session || !session.user || !session.user.companyId || session.user.type !== 'company') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const [companyRes, reviewsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${session.user.companyId}`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${session.user.companyId}/reviews`),
    ]);

    const [company, reviews] = await Promise.all([
      companyRes.json(),
      reviewsRes.json(),
    ]);

    return {
      props: {
        company,
        reviews,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    };
  }
};
