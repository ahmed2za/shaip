import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { ShieldCheckIcon, LockClosedIcon, KeyIcon } from '@heroicons/react/24/outline';

interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    requireUppercase: boolean;
    maxAge: number;
  };
  loginAttempts: {
    maxAttempts: number;
    lockoutDuration: number;
  };
  sessionSettings: {
    sessionTimeout: number;
    maxConcurrentSessions: number;
  };
}

export default function SecuritySettings() {
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    passwordPolicy: {
      minLength: 8,
      requireNumbers: true,
      requireSpecialChars: true,
      requireUppercase: true,
      maxAge: 90,
    },
    loginAttempts: {
      maxAttempts: 5,
      lockoutDuration: 30,
    },
    sessionSettings: {
      sessionTimeout: 30,
      maxConcurrentSessions: 3,
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSecuritySettings();
  }, []);

  const fetchSecuritySettings = async () => {
    try {
      const response = await fetch('/api/admin/security-settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching security settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SecuritySettings>) => {
    try {
      const response = await fetch('/api/admin/security-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error updating security settings:', error);
    }
  };

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <ShieldCheckIcon className="h-6 w-6 text-blue-500 ml-2" />
          المصادقة الثنائية
        </h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700">تفعيل المصادقة الثنائية للمشرفين</p>
              <p className="text-sm text-gray-500">
                يتطلب من جميع المشرفين استخدام المصادقة الثنائية للدخول
              </p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onChange={(checked) => updateSettings({ twoFactorAuth: checked })}
              className={`${
                settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">تفعيل المصادقة الثنائية</span>
              <span
                className={`${
                  settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <LockClosedIcon className="h-6 w-6 text-blue-500 ml-2" />
          سياسة كلمة المرور
        </h3>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                الحد الأدنى لطول كلمة المرور
              </label>
              <input
                type="number"
                value={settings.passwordPolicy.minLength}
                onChange={(e) =>
                  updateSettings({
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      minLength: parseInt(e.target.value),
                    },
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                مدة صلاحية كلمة المرور (بالأيام)
              </label>
              <input
                type="number"
                value={settings.passwordPolicy.maxAge}
                onChange={(e) =>
                  updateSettings({
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      maxAge: parseInt(e.target.value),
                    },
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            {[
              {
                key: 'requireNumbers',
                label: 'تتطلب أرقام',
              },
              {
                key: 'requireSpecialChars',
                label: 'تتطلب رموز خاصة',
              },
              {
                key: 'requireUppercase',
                label: 'تتطلب حروف كبيرة',
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center">
                <Switch
                  checked={settings.passwordPolicy[item.key as keyof typeof settings.passwordPolicy]}
                  onChange={(checked) =>
                    updateSettings({
                      passwordPolicy: {
                        ...settings.passwordPolicy,
                        [item.key]: checked,
                      },
                    })
                  }
                  className={`${
                    settings.passwordPolicy[item.key as keyof typeof settings.passwordPolicy]
                      ? 'bg-blue-600'
                      : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full ml-3`}
                >
                  <span
                    className={`${
                      settings.passwordPolicy[item.key as keyof typeof settings.passwordPolicy]
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <KeyIcon className="h-6 w-6 text-blue-500 ml-2" />
          إعدادات تسجيل الدخول
        </h3>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                الحد الأقصى لمحاولات تسجيل الدخول
              </label>
              <input
                type="number"
                value={settings.loginAttempts.maxAttempts}
                onChange={(e) =>
                  updateSettings({
                    loginAttempts: {
                      ...settings.loginAttempts,
                      maxAttempts: parseInt(e.target.value),
                    },
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                مدة القفل (بالدقائق)
              </label>
              <input
                type="number"
                value={settings.loginAttempts.lockoutDuration}
                onChange={(e) =>
                  updateSettings({
                    loginAttempts: {
                      ...settings.loginAttempts,
                      lockoutDuration: parseInt(e.target.value),
                    },
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">إعدادات الجلسة</h3>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                مهلة الجلسة (بالدقائق)
              </label>
              <input
                type="number"
                value={settings.sessionSettings.sessionTimeout}
                onChange={(e) =>
                  updateSettings({
                    sessionSettings: {
                      ...settings.sessionSettings,
                      sessionTimeout: parseInt(e.target.value),
                    },
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                الحد الأقصى للجلسات المتزامنة
              </label>
              <input
                type="number"
                value={settings.sessionSettings.maxConcurrentSessions}
                onChange={(e) =>
                  updateSettings({
                    sessionSettings: {
                      ...settings.sessionSettings,
                      maxConcurrentSessions: parseInt(e.target.value),
                    },
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
