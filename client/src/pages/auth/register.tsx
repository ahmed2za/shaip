import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import SocialLogin from '@/components/auth/SocialLogin';

export default function Register() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<'user' | 'company'>('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    // Company specific fields
    companyName: '',
    website: '',
    description: '',
    category: '',
    location: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error('كلمات المرور غير متطابقة');
        return;
      }

      if (accountType === 'company' && (!formData.companyName || !formData.category)) {
        toast.error('يرجى ملء جميع الحقول المطلوبة');
        return;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: accountType,
        }),
      });

      if (!response.ok) {
        throw new Error('فشل التسجيل');
      }

      toast.success('تم التسجيل بنجاح');
      router.push('/auth/login');
    } catch (error) {
      toast.error('حدث خطأ أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'تقنية المعلومات',
    'التجارة الإلكترونية',
    'الخدمات المالية',
    'التعليم',
    'الصحة',
    'المطاعم',
    'السياحة والسفر',
    'العقارات',
    'المقاولات',
    'أخرى',
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/">
            <a>
              <Image
                src="/logo.png"
                alt="Logo"
                width={150}
                height={40}
                className="mx-auto"
              />
            </a>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">إنشاء حساب جديد</h2>
          <p className="mt-2 text-sm text-gray-600">
            لديك حساب بالفعل؟{' '}
            <Link href="/auth/login">
              <a className="font-medium text-primary-600 hover:text-primary-500">
                تسجيل الدخول
              </a>
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
              <button
                type="button"
                onClick={() => setAccountType('user')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  accountType === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-500 hover:text-gray-700'
                }`}
              >
                عميل
              </button>
              <button
                type="button"
                onClick={() => setAccountType('company')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  accountType === 'company'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-500 hover:text-gray-700'
                }`}
              >
                شركة
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {accountType === 'user' ? (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    الاسم
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    اسم الشركة
                  </label>
                  <div className="mt-1">
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    التصنيف
                  </label>
                  <div className="mt-1">
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="">اختر التصنيف</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    الموقع الإلكتروني
                  </label>
                  <div className="mt-1">
                    <input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    رقم الهاتف
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                تأكيد كلمة المرور
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {loading ? 'جاري التسجيل...' : 'تسجيل'}
              </button>
            </div>
          </form>

          <SocialLogin />
        </div>
      </div>
    </div>
  );
}
