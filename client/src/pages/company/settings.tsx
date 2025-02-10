import { useState } from 'react';
import { Container, Snackbar, Alert } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import CompanySettings from '@/components/settings/CompanySettings';
import type { Company } from '@/types';

export default function CompanySettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');

  // This would typically come from an API call
  const [company, setCompany] = useState<Company>({
    id: '1',
    name: '',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleSave = async (updatedCompany: Partial<Company>) => {
    try {
      const response = await fetch('/api/company/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCompany),
      });

      if (!response.ok) throw new Error('Failed to update company');

      setMessage('تم تحديث معلومات الشركة بنجاح');
      setSeverity('success');
      
      // Update local state
      setCompany((prev) => ({ ...prev, ...updatedCompany }));
    } catch (error) {
      console.error('Error updating company:', error);
      setMessage('حدث خطأ أثناء تحديث معلومات الشركة');
      setSeverity('error');
    }
  };

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CompanySettings company={company} onSave={handleSave} />

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setMessage('')} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
