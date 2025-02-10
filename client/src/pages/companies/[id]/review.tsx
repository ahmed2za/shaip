import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import StarRating from '@/components/common/StarRating';
import { useSession } from 'next-auth/react';

interface WriteReviewProps {
  company: {
    id: number;
    name: string;
    logo: string;
  };
}

export default function WriteReview({ company }: WriteReviewProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  // if (!session) {
  //   return <div>يجب تسجيل الدخول لعرض هذه الصفحة</div>;
  // }

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error('يرجى اختيار تقييم');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('يرجى كتابة عنوان للتقييم');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('يرجى كتابة محتوى التقييم');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/companies/${company.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('حدث خطأ أثناء إرسال التقييم');
      }

      toast.success('تم إرسال تقييمك بنجاح');
      router.push(`/companies/${company.id}`);
    } catch (error) {
      toast.error('حدث خطأ أثناء إرسال التقييم');
    } finally {
      setLoading(false);
    }
  };

  const getRatingLabel = (rating: number): string => {
    switch (rating) {
      case 5:
        return 'ممتاز';
      case 4:
        return 'جيد جداً';
      case 3:
        return 'متوسط';
      case 2:
        return 'سيء';
      case 1:
        return 'سيء جداً';
      default:
        return 'اختر تقييمك';
    }
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-500';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          {/* Company Info */}
          <div className="flex items-center mb-8">
            <div className="relative h-16 w-16 ml-4">
              <Image
                src={company.logo}
                alt={company.name}
                layout="fill"
                className="rounded-lg"
                objectFit="contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                كتابة تقييم لـ {company.name}
              </h1>
              <Link href={`/companies/${company.id}`}>
                <a className="text-sm text-primary-600 hover:text-primary-700">
                  العودة إلى صفحة الشركة
                </a>
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ما هو تقييمك العام؟
              </label>
              <div className="flex items-center">
                <StarRating
                  rating={formData.rating}
                  onChange={handleRatingChange}
                  interactive
                  size="lg"
                />
                <span className={`mr-4 text-lg font-medium ${getRatingColor(formData.rating)}`}>
                  {getRatingLabel(formData.rating)}
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                عنوان التقييم
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                maxLength={100}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="لخص تجربتك في جملة قصيرة"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                تفاصيل التقييم
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="شارك تجربتك مع هذه الشركة..."
              />
              <p className="mt-2 text-sm text-gray-500">
                يجب أن يكون التقييم موضوعياً وصادقاً ويعبر عن تجربتك الشخصية
              </p>
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
                {loading ? 'جاري النشر...' : 'نشر التقييم'}
              </button>
            </div>
          </form>
        </div>

        {/* Guidelines */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            إرشادات كتابة التقييم
          </h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="ml-2">•</span>
              اكتب تقييماً موضوعياً وصادقاً يعبر عن تجربتك الشخصية
            </li>
            <li className="flex items-start">
              <span className="ml-2">•</span>
              تجنب استخدام لغة مسيئة أو غير لائقة
            </li>
            <li className="flex items-start">
              <span className="ml-2">•</span>
              لا تذكر معلومات شخصية أو حساسة
            </li>
            <li className="flex items-start">
              <span className="ml-2">•</span>
              تأكد من أن تقييمك يتعلق بالشركة وخدماتها
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${params?.id}`);
    const company = await response.json();

    return {
      props: {
        company: {
          id: company.id,
          name: company.name,
          logo: company.logo,
        },
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
