import { useState } from 'react';
import { Container, Paper, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useSession } from 'next-auth/react';
import UserAvatarSettings from '@/components/settings/UserAvatarSettings';
import { useRouter } from 'next/router';

export default function ProfileSettings() {
  const { data: session, update: updateSession } = useSession();
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const handleAvatarChange = async (newAvatarUrl: string) => {
    try {
      const response = await fetch('/api/user/update-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatarUrl: newAvatarUrl }),
      });

      if (!response.ok) throw new Error('Failed to update avatar');

      await updateSession();
      setMessage('تم تحديث الصورة الشخصية بنجاح');
      setSeverity('success');
    } catch (error) {
      console.error('Error updating avatar:', error);
      setMessage('حدث خطأ أثناء تحديث الصورة الشخصية');
      setSeverity('error');
    }
  };

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="right">
        إعدادات الحساب
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <UserAvatarSettings
          currentAvatar={session.user?.image}
          onAvatarChange={handleAvatarChange}
        />
      </Paper>

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
