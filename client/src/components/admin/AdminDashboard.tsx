import React, { useState } from 'react';
import {
  Cog6ToothIcon,
  UsersIcon,
  BuildingOfficeIcon,
  KeyIcon,
  ShieldCheckIcon,
  ChartPieIcon,
  DocumentTextIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';
import UserManagement from './UserManagement';
import CompanyManagement from './CompanyManagement';
import ApiKeyManagement from './ApiKeyManagement';
import SecuritySettings from './SecuritySettings';
import Analytics from './Analytics';
import ContentManagement from './ContentManagement';
import NotificationSettings from './NotificationSettings';
import GeneralSettings from './GeneralSettings';

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState(0);

  const tabs = [
    {
      name: 'لوحة التحكم',
      icon: ChartPieIcon,
      component: <Analytics />,
    },
    {
      name: 'إدارة المستخدمين',
      icon: UsersIcon,
      component: <UserManagement />,
    },
    {
      name: 'إدارة الشركات',
      icon: BuildingOfficeIcon,
      component: <CompanyManagement />,
    },
    {
      name: 'إدارة API',
      icon: KeyIcon,
      component: <ApiKeyManagement />,
    },
    {
      name: 'الأمان',
      icon: ShieldCheckIcon,
      component: <SecuritySettings />,
    },
    {
      name: 'إدارة المحتوى',
      icon: DocumentTextIcon,
      component: <ContentManagement />,
    },
    {
      name: 'الإشعارات',
      icon: BellIcon,
      component: <NotificationSettings />,
    },
    {
      name: 'الإعدادات العامة',
      icon: Cog6ToothIcon,
      component: <GeneralSettings />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم المشرف</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              تحديث النظام
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="إجمالي المستخدمين"
            value="1,234"
            change="+12%"
            trend="up"
          />
          <StatCard
            title="إجمالي الشركات"
            value="567"
            change="+8%"
            trend="up"
          />
          <StatCard
            title="المراجعات اليوم"
            value="89"
            change="-3%"
            trend="down"
          />
          <StatCard
            title="معدل الاستجابة"
            value="98.5%"
            change="+2%"
            trend="up"
          />
        </div>

        <div className="bg-white rounded-lg shadow">
          <Tab.Group onChange={setCurrentTab}>
            <div className="border-b border-gray-200">
              <Tab.List className="flex space-x-8 p-4 overflow-x-auto">
                {tabs.map((tab, index) => (
                  <Tab
                    key={index}
                    className={({ selected }) =>
                      `flex items-center space-x-2 py-2 px-3 text-sm font-medium rounded-md
                      ${
                        selected
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`
                    }
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="p-6">
              {tabs.map((tab, index) => (
                <Tab.Panel key={index}>{tab.component}</Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, trend }: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p
          className={`ml-2 flex items-baseline text-sm font-semibold ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change}
        </p>
      </div>
    </div>
  );
}
