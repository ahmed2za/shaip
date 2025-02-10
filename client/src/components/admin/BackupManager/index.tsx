import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { BackupOutlined, RestoreOutlined } from '@mui/icons-material';

export default function BackupManager() {
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleBackup = async () => {
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create backup');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('content-disposition')?.split('filename=')[1] || 'backup.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess('تم إنشاء نسخة احتياطية بنجاح');
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error('Backup error:', error);
      setError('فشل إنشاء نسخة احتياطية');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) {
      setError('الرجاء اختيار ملف النسخة الاحتياطية');
      return;
    }

    try {
      setIsRestoring(true);
      const fileContent = await selectedFile.text();
      const backupData = JSON.parse(fileContent);

      const response = await fetch('/api/admin/backup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backupData),
      });

      if (!response.ok) {
        throw new Error('Failed to restore backup');
      }

      setSuccess('تم استعادة النسخة الاحتياطية بنجاح');
      setRestoreDialogOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Restore error:', error);
      setError('فشل استعادة النسخة الاحتياطية');
    } finally {
      setIsRestoring(false);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json') {
        setError('الرجاء اختيار ملف JSON صالح');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        النسخ الاحتياطي واستعادة البيانات
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<BackupOutlined />}
          onClick={handleBackup}
        >
          إنشاء نسخة احتياطية
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RestoreOutlined />}
          onClick={() => setRestoreDialogOpen(true)}
        >
          استعادة من نسخة احتياطية
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Dialog
        open={restoreDialogOpen}
        onClose={() => !isRestoring && setRestoreDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>استعادة من نسخة احتياطية</DialogTitle>
        <DialogContent>
          <Box py={2}>
            <Typography gutterBottom color="warning.main">
              تحذير: سيؤدي هذا إلى استبدال جميع البيانات الحالية بالبيانات من النسخة الاحتياطية.
            </Typography>
            <input
              type="file"
              accept="application/json"
              onChange={handleFileSelect}
              disabled={isRestoring}
              style={{ marginTop: '16px' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRestoreDialogOpen(false)}
            disabled={isRestoring}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleRestore}
            color="primary"
            disabled={!selectedFile || isRestoring}
            startIcon={isRestoring ? <CircularProgress size={20} /> : undefined}
          >
            {isRestoring ? 'جاري الاستعادة...' : 'استعادة'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
