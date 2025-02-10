import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import {
  ChartBarIcon,
  StarIcon,
  CodeBracketIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import ReviewList from './ReviewList';
import WidgetGenerator from './WidgetGenerator';
import ReviewTemplateManager from './ReviewTemplateManager';
import Analytics from './Analytics';

interface CompanyDashboardProps {
  companyId: string;
}

export default function CompanyDashboard({ companyId }: CompanyDashboardProps) {
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    responseRate: 0,
    recentReviews: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`/api/companies/${companyId}/stats`);
      const data = await res.json();
      setStats(data);
    };

    fetchStats();
  }, [companyId]);

  const tabs = [
    {
      name: 'Analytics',
      icon: ChartBarIcon,
      component: <Analytics companyId={companyId} />,
    },
    {
      name: 'Reviews',
      icon: StarIcon,
      component: <ReviewList companyId={companyId} />,
    },
    {
      name: 'Widgets',
      icon: CodeBracketIcon,
      component: <WidgetGenerator companyId={companyId} />,
    },
    {
      name: 'Review Templates',
      icon: EnvelopeIcon,
      component: <ReviewTemplateManager companyId={companyId} />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Rating
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.averageRating.toFixed(1)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Reviews
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.totalReviews}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EnvelopeIcon className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Response Rate
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.responseRate}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className="rounded-xl bg-white p-6 shadow-lg ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
            >
              {tab.component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
