import React, { useCallback, useState } from 'react';
import { Box, Button, Typography, Avatar, CircularProgress } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';

interface UserAvatarSettingsProps {
  currentAvatar?: string;
  onAvatarChange: (newAvatarUrl: string) => Promise<void>;
}

export default function UserAvatarSettings({ currentAvatar, onAvatarChange }: UserAvatarSettingsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { data: session } = useSession();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'user_avatars'); // Configure this in your Cloudinary dashboard

      const response = await fetch(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      await onAvatarChange(data.secure_url);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploading(false);
    }
  }, [onAvatarChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleSocialLogin = async (provider: string) => {
    await signIn(provider);
  };

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h6" gutterBottom align="right">
        تحديث الصورة الشخصية
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Avatar
          src={currentAvatar || '/images/avatar-placeholder.png'}
          alt="صورة المستخدم"
          sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
        />

        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 1,
            p: 3,
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <CircularProgress size={24} />
          ) : (
            <Typography align="center" color="textSecondary">
              {isDragActive
                ? 'اسحب الصورة هنا...'
                : 'اسحب وأفلت صورة هنا، أو انقر للاختيار'}
            </Typography>
          )}
        </Box>
      </Box>

      <Typography variant="subtitle1" gutterBottom align="right">
        أو استخدم صورة من حساباتك الاجتماعية
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handleSocialLogin('google')}
          startIcon={<Image src="/images/google-icon.png" alt="Google" width={20} height={20} />}
        >
          Google
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleSocialLogin('facebook')}
          startIcon={<Image src="/images/facebook-icon.png" alt="Facebook" width={20} height={20} />}
        >
          Facebook
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleSocialLogin('twitter')}
          startIcon={<Image src="/images/twitter-icon.png" alt="Twitter" width={20} height={20} />}
        >
          Twitter
        </Button>
      </Box>
    </Box>
  );
}
