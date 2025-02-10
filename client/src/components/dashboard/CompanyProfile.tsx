import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface CompanyProfileProps {
  company: {
    id: number;
    name: string;
    logo: string;
    description?: string;
    website?: string;
    location?: string;
    phone?: string;
    email?: string;
    category?: string;
    workingHours?: {
      from: string;
      to: string;
    };
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
}

export default function CompanyProfile({ company }: CompanyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(company);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialMediaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value,
      },
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }
      setLogoFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload logo if changed
      let logoUrl = company.logo;
      if (logoFile) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('فشل رفع الشعار');
        const { url } = await uploadRes.json();
        logoUrl = url;
      }

      // Update company profile
      const response = await fetch(`/api/companies/${company.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          logo: logoUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('فشل تحديث الملف التعريفي');
      }

      toast.success('تم تحديث الملف التعريفي بنجاح');
      setIsEditing(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الملف التعريفي');
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
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {isEditing ? 'إلغاء التعديل' : 'تعديل الملف التعريفي'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Logo Section */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">شعار الشركة</h3>
          <div className="flex items-center space-x-6 space-x-reverse">
            <div className="relative h-24 w-24">
              <Image
                src={logoFile ? URL.createObjectURL(logoFile) : company.logo}
                alt={company.name}
                layout="fill"
                className="rounded-lg object-cover"
              />
            </div>
            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  تغيير الشعار
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100"
                />
              </div>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            المعلومات الأساسية
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                اسم الشركة
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                التصنيف
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                وصف الشركة
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            معلومات الاتصال
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                رقم الهاتف
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                الموقع الإلكتروني
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                العنوان
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            ساعات العمل
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                من
              </label>
              <input
                type="time"
                name="workingHours.from"
                value={formData.workingHours?.from}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                إلى
              </label>
              <input
                type="time"
                name="workingHours.to"
                value={formData.workingHours?.to}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            وسائل التواصل الاجتماعي
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                فيسبوك
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.socialMedia?.facebook}
                onChange={handleSocialMediaChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                تويتر
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.socialMedia?.twitter}
                onChange={handleSocialMediaChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                إنستغرام
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.socialMedia?.instagram}
                onChange={handleSocialMediaChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                لينكد إن
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.socialMedia?.linkedin}
                onChange={handleSocialMediaChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
