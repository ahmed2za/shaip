import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { StarIcon } from '@heroicons/react/24/solid';
import Layout from '@/components/layout/Layout';

interface WriteReviewProps {
  company: {
    id: string;
    name: string;
    logo: string;
    description: string;
  };
}

export default function WriteReview({ company }: WriteReviewProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: company.id,
          rating,
          title,
          content,
          pros,
          cons,
        }),
      });

      if (!response.ok) {
        throw new Error('حدث خطأ أثناء إرسال التقييم');
      }

      router.push(`/company/${company.id}`);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('حدث خطأ أثناء إرسال التقييم. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>كتابة تقييم - {company.name}</title>
      </Head>

      <div className="mx-auto max-w-3xl px-6 py-8 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center gap-x-4">
              <div className="relative h-16 w-16 flex-none rounded-lg bg-white">
                {company.logo ? (
                  <Image
                    src={company.logo}
                    alt={company.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-gray-400">
                      {company.name[0]}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  كتابة تقييم لـ {company.name}
                </h1>
                <p className="mt-1 text-sm text-gray-500">{company.description}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                ما هو تقييمك العام؟
              </label>
              <div className="flex gap-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="relative"
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                  >
                    <StarIcon
                      className={`h-10 w-10 ${
                        star <= (hover || rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                    <span className="sr-only">{star} نجوم</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                عنوان التقييم
              </label>
              <input
                type="text"
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="اكتب عنواناً موجزاً لتقييمك"
              />
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                تفاصيل التقييم
              </label>
              <textarea
                id="content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="اشرح تجربتك بالتفصيل"
              />
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="pros"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  الإيجابيات
                </label>
                <textarea
                  id="pros"
                  value={pros}
                  onChange={(e) => setPros(e.target.value)}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="ما الذي أعجبك؟"
                />
              </div>
              <div>
                <label
                  htmlFor="cons"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  السلبيات
                </label>
                <textarea
                  id="cons"
                  value={cons}
                  onChange={(e) => setCons(e.target.value)}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="ما الذي لم يعجبك؟"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={!rating || isSubmitting}
                className="rounded-full bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'جاري النشر...' : 'نشر التقييم'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // هنا سنقوم بجلب بيانات الشركة من الخادم
  // في هذا المثال نستخدم بيانات وهمية
  const company = {
    id: '1',
    name: 'مطعم الذواق',
    description: 'أشهى المأكولات الشرقية والغربية',
    logo: '/images/restaurant.jpg',
  };

  return {
    props: {
      company,
    },
  };
};
