import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { CircularProgress, Box } from '@mui/material';

import CompanyDashboard from './CompanyDashboard';

export default function CompanyIndex() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
    } else if (session.user.role === 'company') {
      router.push('/company/dashboard');
    } else {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (session && session.user.role === 'company') {
    return <CompanyDashboard />;
  }

  return null;
}
