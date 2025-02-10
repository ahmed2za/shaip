import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import EditCompanyForm from './EditCompanyForm';

interface Company {
  id: number;
  name: string;
  logo: string;
  website: string;
  category: string;
  description: string;
  isVerified: boolean;
  createdAt: string;
}

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب الشركات');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: number, isVerified: boolean) => {
    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVerified }),
      });

      if (response.ok) {
        setCompanies(companies.map(company =>
          company.id === id ? { ...company, isVerified } : company
        ));
        toast.success(isVerified ? 'تم توثيق الشركة' : 'تم إلغاء توثيق الشركة');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث حالة التوثيق');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الشركة؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCompanies(companies.filter(company => company.id !== id));
        toast.success('تم حذف الشركة بنجاح');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الشركة');
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">قائمة الشركات</h2>
        <button
          onClick={() => {
            setSelectedCompany(null);
            setShowEditModal(true);
          }}
          className="btn btn-primary"
        >
          إضافة شركة جديدة
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الشركة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التصنيف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاريخ الإضافة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => (
              <tr key={company.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={company.logo}
                        alt={company.name}
                      />
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">
                        {company.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {company.website}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {company.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleVerify(company.id, !company.isVerified)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      company.isVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {company.isVerified ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4 ml-1" />
                        موثقة
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="h-4 w-4 ml-1" />
                        غير موثقة
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(company.createdAt).toLocaleDateString('ar-SA')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedCompany(company);
                      setShowEditModal(true);
                    }}
                    className="text-primary-600 hover:text-primary-900 ml-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedCompany ? 'تعديل الشركة' : 'إضافة شركة جديدة'}
            </h3>
            <EditCompanyForm
              company={selectedCompany || undefined}
              onClose={() => setShowEditModal(false)}
              onSave={() => {
                setShowEditModal(false);
                fetchCompanies();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
