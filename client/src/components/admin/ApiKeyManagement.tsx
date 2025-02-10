import React, { useState, useEffect } from 'react';
import { KeyIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'inactive';
  permissions: string[];
}

export default function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    permissions: [] as string[],
  });

  const availablePermissions = [
    { id: 'read_reviews', name: 'قراءة المراجعات' },
    { id: 'write_reviews', name: 'كتابة المراجعات' },
    { id: 'manage_companies', name: 'إدارة الشركات' },
    { id: 'manage_users', name: 'إدارة المستخدمين' },
    { id: 'analytics', name: 'تحليلات البيانات' },
  ];

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/admin/api-keys');
      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  };

  const createApiKey = async () => {
    try {
      const response = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newKeyData),
      });
      const data = await response.json();
      setApiKeys([...apiKeys, data]);
      setShowNewKeyModal(false);
      setNewKeyData({ name: '', permissions: [] });
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const deleteApiKey = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف مفتاح API هذا؟')) return;

    try {
      await fetch(`/api/admin/api-keys/${id}`, {
        method: 'DELETE',
      });
      setApiKeys(apiKeys.filter((key) => key.id !== id));
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  const toggleKeyStatus = async (id: string, currentStatus: string) => {
    try {
      const response = await fetch(`/api/admin/api-keys/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: currentStatus === 'active' ? 'inactive' : 'active',
        }),
      });
      const updatedKey = await response.json();
      setApiKeys(
        apiKeys.map((key) => (key.id === id ? updatedKey : key))
      );
    } catch (error) {
      console.error('Error toggling API key status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">إدارة مفاتيح API</h2>
        <button
          onClick={() => setShowNewKeyModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 ml-2" />
          إنشاء مفتاح جديد
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {apiKeys.map((apiKey) => (
            <li key={apiKey.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <KeyIcon className="h-8 w-8 text-gray-400" />
                  <div className="mr-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {apiKey.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      آخر استخدام: {new Date(apiKey.lastUsed).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Switch
                    checked={apiKey.status === 'active'}
                    onChange={() => toggleKeyStatus(apiKey.id, apiKey.status)}
                    className={`${
                      apiKey.status === 'active' ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">تفعيل المفتاح</span>
                    <span
                      className={`${
                        apiKey.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                  <button
                    onClick={() => deleteApiKey(apiKey.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <code className="text-sm text-gray-700">{apiKey.key}</code>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {apiKey.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {availablePermissions.find((p) => p.id === permission)?.name}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showNewKeyModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              إنشاء مفتاح API جديد
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  اسم المفتاح
                </label>
                <input
                  type="text"
                  value={newKeyData.name}
                  onChange={(e) =>
                    setNewKeyData({ ...newKeyData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  الصلاحيات
                </label>
                <div className="mt-2 space-y-2">
                  {availablePermissions.map((permission) => (
                    <label
                      key={permission.id}
                      className="inline-flex items-center"
                    >
                      <input
                        type="checkbox"
                        checked={newKeyData.permissions.includes(permission.id)}
                        onChange={(e) => {
                          const permissions = e.target.checked
                            ? [...newKeyData.permissions, permission.id]
                            : newKeyData.permissions.filter(
                                (p) => p !== permission.id
                              );
                          setNewKeyData({ ...newKeyData, permissions });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="mr-2 text-sm text-gray-700">
                        {permission.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowNewKeyModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300"
              >
                إلغاء
              </button>
              <button
                onClick={createApiKey}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                إنشاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
