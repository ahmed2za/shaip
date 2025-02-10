import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { StarIcon } from '@heroicons/react/24/solid';

interface ReviewFormProps {
  companyId: string;
  onSuccess: () => void;
}

const ReviewForm = ({ companyId, onSuccess }: ReviewFormProps) => {
  const [error, setError] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const formik = useFormik({
    initialValues: {
      rating: 0,
      title: '',
      content: '',
      pros: '',
      cons: ''
    },
    validationSchema: Yup.object({
      rating: Yup.number()
        .min(1, 'يرجى اختيار تقييم')
        .required('التقييم مطلوب'),
      title: Yup.string()
        .required('عنوان المراجعة مطلوب'),
      content: Yup.string()
        .min(20, 'يجب أن تحتوي المراجعة على 20 حرفاً على الأقل')
        .required('محتوى المراجعة مطلوب')
    }),
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('يجب تسجيل الدخول لإضافة مراجعة');
        }

        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({
            ...values,
            companyId
          })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'حدث خطأ أثناء إضافة المراجعة');
        }

        onSuccess();
        formik.resetForm();
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      }
    }
  });

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`h-8 w-8 cursor-pointer ${
          index < (hoveredRating || formik.values.rating)
            ? 'text-yellow-400'
            : 'text-gray-300'
        }`}
        onMouseEnter={() => setHoveredRating(index + 1)}
        onMouseLeave={() => setHoveredRating(0)}
        onClick={() => formik.setFieldValue('rating', index + 1)}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">أضف مراجعتك</h3>
      
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تقييمك
          </label>
          <div className="flex gap-1">
            {renderStars()}
          </div>
          {formik.touched.rating && formik.errors.rating && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.rating}</div>
          )}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            عنوان المراجعة
          </label>
          <input
            type="text"
            id="title"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            {...formik.getFieldProps('title')}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            محتوى المراجعة
          </label>
          <textarea
            id="content"
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            {...formik.getFieldProps('content')}
          />
          {formik.touched.content && formik.errors.content && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.content}</div>
          )}
        </div>

        <div>
          <label htmlFor="pros" className="block text-sm font-medium text-gray-700 mb-2">
            الإيجابيات
          </label>
          <textarea
            id="pros"
            rows={2}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            {...formik.getFieldProps('pros')}
          />
        </div>

        <div>
          <label htmlFor="cons" className="block text-sm font-medium text-gray-700 mb-2">
            السلبيات
          </label>
          <textarea
            id="cons"
            rows={2}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            {...formik.getFieldProps('cons')}
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          نشر المراجعة
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
