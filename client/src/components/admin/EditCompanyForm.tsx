import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface Company {
  id?: number;
  name: string;
  logo: string;
  website: string;
  description: string;
  category: string;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  isVerified: boolean;
}

interface EditCompanyFormProps {
  company?: Company;
  onClose: () => void;
  onSave: () => void;
}

export default function EditCompanyForm({ company, onClose, onSave }: EditCompanyFormProps) {
  const [formData, setFormData] = useState<Company>({
    name: '',
    logo: '',
    website: '',
    description: '',
    category: 'تقنية المعلومات',
    isVerified: false,
    location: {
      lat: 24.7136,
      lng: 46.6753,
      name: 'الرياض'
    }
  });
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'تقنية المعلومات',
    'اتصالات',
    'خدمات مالية',
    'تجارة إلكترونية',
    'صناعة',
    'خدمات لوجستية',
    'أخرى'
  ];

  const cities = [
    'الرياض',
    'جدة',
    'الدمام',
    'مكة المكرمة',
    'المدينة المنورة',
    'الخبر',
    'تبوك',
    'أخرى'
  ];

  useEffect(() => {
    if (company) {
      setFormData(company);
      setLogoPreview(company.logo);
    }
  }, [company]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    // هنا يمكن إضافة خدمة للحصول على إحداثيات المدينة
    // للتبسيط، نستخدم إحداثيات ثابتة
    const coordinates = {
      'الرياض': { lat: 24.7136, lng: 46.6753 },
      'جدة': { lat: 21.5433, lng: 39.1728 },
      'الدمام': { lat: 26.4207, lng: 50.0888 },
      'مكة المكرمة': { lat: 21.3891, lng: 39.8579 },
      'المدينة المنورة': { lat: 24.5247, lng: 39.5692 },
      'الخبر': { lat: 26.2172, lng: 50.1971 },
      'تبوك': { lat: 28.3998, lng: 36.5714 }
    }[cityName] || { lat: 24.7136, lng: 46.6753 };

    setFormData(prev => ({
      ...prev,
      location: {
        ...coordinates,
        name: cityName
      }
    }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    // في التطبيق الحقيقي، سنقوم برفع الصورة إلى خدمة تخزين مثل S3
    // هنا نقوم بتحويلها إلى URL محلي للعرض
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setLogoPreview(result);
      setFormData(prev => ({
        ...prev,
        logo: result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = company?.id 
        ? `/api/companies/${company.id}`
        : '/api/companies';

      const response = await fetch(url, {
        method: company?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(company?.id ? 'تم تحديث الشركة بنجاح' : 'تم إضافة الشركة بنجاح');
        onSave();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ الشركة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            اسم الشركة
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 form-input"
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            الموقع الإلكتروني
          </label>
          <input
            type="url"
            name="website"
            id="website"
            required
            value={formData.website}
            onChange={handleInputChange}
            className="mt-1 form-input"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            التصنيف
          </label>
          <select
            name="category"
            id="category"
            required
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 form-input"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            المدينة
          </label>
          <select
            name="location"
            id="location"
            required
            value={formData.location?.name}
            onChange={handleLocationChange}
            className="mt-1 form-input"
          >
            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          وصف الشركة
        </label>
        <textarea
          name="description"
          id="description"
          rows={4}
          required
          value={formData.description}
          onChange={handleInputChange}
          className="mt-1 form-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          شعار الشركة
        </label>
        <div className="mt-1 flex items-center">
          {logoPreview && (
            <div className="relative h-32 w-32 rounded-lg overflow-hidden">
              <Image
                src={logoPreview}
                alt="Company logo preview"
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}
          <label
            htmlFor="logo-upload"
            className="mr-5 btn btn-secondary cursor-pointer"
          >
            <span>تغيير الشعار</span>
            <input
              id="logo-upload"
              name="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isVerified"
          id="isVerified"
          checked={formData.isVerified}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            isVerified: e.target.checked
          }))}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ml-2"
        />
        <label htmlFor="isVerified" className="text-sm text-gray-700">
          شركة موثقة
        </label>
      </div>

      <div className="flex justify-end space-x-4 space-x-reverse">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
          disabled={loading}
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'جاري الحفظ...' : company?.id ? 'تحديث' : 'إضافة'}
        </button>
      </div>
    </form>
  );
}
