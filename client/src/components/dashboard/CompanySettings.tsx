import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Switch } from '@headlessui/react';

interface CompanySettingsProps {
  company: {
    id: number;
    notifications: {
      email: boolean;
      push: boolean;
      reviews: boolean;
      messages: boolean;
    };
    privacy: {
      showEmail: boolean;
      showPhone: boolean;
      showLocation: boolean;
      showSocialMedia: boolean;
    };
    autoResponse: {
      enabled: boolean;
      message: string;
    };
  };
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function CompanySettings({ company }: CompanySettingsProps) {
  const [settings, setSettings] = useState({
    notifications: company.notifications,
    privacy: company.privacy,
    autoResponse: company.autoResponse,
  });
  const [loading, setLoading] = useState(false);

  const handleToggleChange = (
    section: 'notifications' | 'privacy',
    key: string,
    value: boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleAutoResponseChange = (enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      autoResponse: {
        ...prev.autoResponse,
        enabled,
      },
    }));
  };

  const handleAutoResponseMessageChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSettings(prev => ({
      ...prev,
      autoResponse: {
        ...prev.autoResponse,
        message: e.target.value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/companies/${company.id}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('فشل تحديث الإعدادات');
      }

      toast.success('تم تحديث الإعدادات بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          إعدادات الإشعارات
        </h3>
        <div className="space-y-4">
          <Switch.Group>
            <div className="flex items-center justify-between">
              <Switch.Label className="text-sm text-gray-700">
                إشعارات البريد الإلكتروني
              </Switch.Label>
              <Switch
                checked={settings.notifications.email}
                onChange={(checked) =>
                  handleToggleChange('notifications', 'email', checked)
                }
                className={classNames(
                  settings.notifications.email ? 'bg-primary-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                )}
              >
                <span
                  className={classNames(
                    settings.notifications.email ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
          </Switch.Group>

          <Switch.Group>
            <div className="flex items-center justify-between">
              <Switch.Label className="text-sm text-gray-700">
                إشعارات الموقع
              </Switch.Label>
              <Switch
                checked={settings.notifications.push}
                onChange={(checked) =>
                  handleToggleChange('notifications', 'push', checked)
                }
                className={classNames(
                  settings.notifications.push ? 'bg-primary-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                )}
              >
                <span
                  className={classNames(
                    settings.notifications.push ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
          </Switch.Group>

          <Switch.Group>
            <div className="flex items-center justify-between">
              <Switch.Label className="text-sm text-gray-700">
                إشعارات التقييمات الجديدة
              </Switch.Label>
              <Switch
                checked={settings.notifications.reviews}
                onChange={(checked) =>
                  handleToggleChange('notifications', 'reviews', checked)
                }
                className={classNames(
                  settings.notifications.reviews ? 'bg-primary-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                )}
              >
                <span
                  className={classNames(
                    settings.notifications.reviews ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
          </Switch.Group>

          <Switch.Group>
            <div className="flex items-center justify-between">
              <Switch.Label className="text-sm text-gray-700">
                إشعارات الرسائل
              </Switch.Label>
              <Switch
                checked={settings.notifications.messages}
                onChange={(checked) =>
                  handleToggleChange('notifications', 'messages', checked)
                }
                className={classNames(
                  settings.notifications.messages ? 'bg-primary-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                )}
              >
                <span
                  className={classNames(
                    settings.notifications.messages ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
          </Switch.Group>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          إعدادات الخصوصية
        </h3>
        <div className="space-y-4">
          <Switch.Group>
            <div className="flex items-center justify-between">
              <Switch.Label className="text-sm text-gray-700">
                عرض البريد الإلكتروني للزوار
              </Switch.Label>
              <Switch
                checked={settings.privacy.showEmail}
                onChange={(checked) =>
                  handleToggleChange('privacy', 'showEmail', checked)
                }
                className={classNames(
                  settings.privacy.showEmail ? 'bg-primary-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                )}
              >
                <span
                  className={classNames(
                    settings.privacy.showEmail ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
          </Switch.Group>

          <Switch.Group>
            <div className="flex items-center justify-between">
              <Switch.Label className="text-sm text-gray-700">
                عرض رقم الهاتف للزوار
              </Switch.Label>
              <Switch
                checked={settings.privacy.showPhone}
                onChange={(checked) =>
                  handleToggleChange('privacy', 'showPhone', checked)
                }
                className={classNames(
                  settings.privacy.showPhone ? 'bg-primary-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                )}
              >
                <span
                  className={classNames(
                    settings.privacy.showPhone ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
          </Switch.Group>

          <Switch.Group>
            <div className="flex items-center justify-between">
              <Switch.Label className="text-sm text-gray-700">
                عرض العنوان للزوار
              </Switch.Label>
              <Switch
                checked={settings.privacy.showLocation}
                onChange={(checked) =>
                  handleToggleChange('privacy', 'showLocation', checked)
                }
                className={classNames(
                  settings.privacy.showLocation ? 'bg-primary-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                )}
              >
                <span
                  className={classNames(
                    settings.privacy.showLocation ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
          </Switch.Group>

          <Switch.Group>
            <div className="flex items-center justify-between">
              <Switch.Label className="text-sm text-gray-700">
                عرض وسائل التواصل الاجتماعي للزوار
              </Switch.Label>
              <Switch
                checked={settings.privacy.showSocialMedia}
                onChange={(checked) =>
                  handleToggleChange('privacy', 'showSocialMedia', checked)
                }
                className={classNames(
                  settings.privacy.showSocialMedia ? 'bg-primary-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                )}
              >
                <span
                  className={classNames(
                    settings.privacy.showSocialMedia ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
          </Switch.Group>
        </div>
      </div>

      {/* Auto Response Settings */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            الرد التلقائي على التقييمات
          </h3>
          <Switch
            checked={settings.autoResponse.enabled}
            onChange={handleAutoResponseChange}
            className={classNames(
              settings.autoResponse.enabled ? 'bg-primary-600' : 'bg-gray-200',
              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            )}
          >
            <span
              className={classNames(
                settings.autoResponse.enabled ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
              )}
            />
          </Switch>
        </div>
        {settings.autoResponse.enabled && (
          <div>
            <label
              htmlFor="autoResponseMessage"
              className="block text-sm font-medium text-gray-700"
            >
              نص الرد التلقائي
            </label>
            <textarea
              id="autoResponseMessage"
              rows={4}
              value={settings.autoResponse.message}
              onChange={handleAutoResponseMessageChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="شكراً لتقييمكم، سنقوم بالرد عليكم في أقرب وقت ممكن."
            />
            <p className="mt-2 text-sm text-gray-500">
              سيتم إرسال هذا الرد تلقائياً على جميع التقييمات الجديدة
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`
            inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
            text-sm font-medium text-white bg-primary-600 hover:bg-primary-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
            ${loading ? 'opacity-75 cursor-not-allowed' : ''}
          `}
        >
          {loading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>
    </form>
  );
}
