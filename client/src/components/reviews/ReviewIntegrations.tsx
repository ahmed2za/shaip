import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CloudDownload as CloudDownloadIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

interface NotificationSettings {
  id: string;
  type: 'email' | 'slack' | 'webhook';
  target: string;
  events: string[];
  enabled: boolean;
}

interface ExportSettings {
  format: 'csv' | 'json' | 'excel';
  frequency: 'daily' | 'weekly' | 'monthly';
  destination: string;
  enabled: boolean;
}

export default function ReviewIntegrations() {
  const [notifications, setNotifications] = useState<NotificationSettings[]>([
    {
      id: '1',
      type: 'email',
      target: 'admin@example.com',
      events: ['new_review', 'reported_review'],
      enabled: true,
    },
    {
      id: '2',
      type: 'slack',
      target: 'https://hooks.slack.com/...',
      events: ['new_review', 'low_rating'],
      enabled: true,
    },
  ]);

  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'csv',
    frequency: 'weekly',
    destination: 'email',
    enabled: true,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationSettings | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleOpenDialog = (notification?: NotificationSettings) => {
    if (notification) {
      setSelectedNotification(notification);
      setEditMode(true);
    } else {
      setSelectedNotification({
        id: String(Date.now()),
        type: 'email',
        target: '',
        events: [],
        enabled: true,
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNotification(null);
    setEditMode(false);
  };

  const handleSaveNotification = () => {
    if (selectedNotification) {
      if (editMode) {
        setNotifications(notifications.map(n =>
          n.id === selectedNotification.id ? selectedNotification : n
        ));
      } else {
        setNotifications([...notifications, selectedNotification]);
      }
    }
    handleCloseDialog();
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting reviews...');
  };

  return (
    <Box>
      <Stack spacing={3}>
        {/* Notification Settings */}
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">إعدادات الإشعارات</Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => handleOpenDialog()}
              >
                إضافة إشعار جديد
              </Button>
            </Stack>

            <Grid container spacing={2}>
              {notifications.map((notification) => (
                <Grid item xs={12} md={6} key={notification.id}>
                  <Card>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="subtitle1">
                            {notification.type === 'email'
                              ? 'بريد إلكتروني'
                              : notification.type === 'slack'
                              ? 'Slack'
                              : 'Webhook'}
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(notification)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </Stack>

                        <Typography variant="body2" color="text.secondary">
                          {notification.target}
                        </Typography>

                        <Stack direction="row" spacing={1}>
                          {notification.events.map((event) => (
                            <Chip
                              key={event}
                              label={
                                event === 'new_review'
                                  ? 'مراجعة جديدة'
                                  : event === 'reported_review'
                                  ? 'إبلاغ عن مراجعة'
                                  : 'تقييم منخفض'
                              }
                              size="small"
                            />
                          ))}
                        </Stack>

                        <FormControlLabel
                          control={
                            <Switch
                              checked={notification.enabled}
                              onChange={(e) => {
                                setNotifications(
                                  notifications.map((n) =>
                                    n.id === notification.id
                                      ? { ...n, enabled: e.target.checked }
                                      : n
                                  )
                                );
                              }}
                            />
                          }
                          label="تفعيل"
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Paper>

        {/* Export Settings */}
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">إعدادات التصدير</Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="تنسيق الملف"
                  value={exportSettings.format}
                  onChange={(e) =>
                    setExportSettings({
                      ...exportSettings,
                      format: e.target.value as ExportSettings['format'],
                    })
                  }
                >
                  <MenuItem value="csv">CSV</MenuItem>
                  <MenuItem value="json">JSON</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="تكرار التصدير"
                  value={exportSettings.frequency}
                  onChange={(e) =>
                    setExportSettings({
                      ...exportSettings,
                      frequency: e.target.value as ExportSettings['frequency'],
                    })
                  }
                >
                  <MenuItem value="daily">يومياً</MenuItem>
                  <MenuItem value="weekly">أسبوعياً</MenuItem>
                  <MenuItem value="monthly">شهرياً</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="وجهة التصدير"
                  value={exportSettings.destination}
                  onChange={(e) =>
                    setExportSettings({
                      ...exportSettings,
                      destination: e.target.value,
                    })
                  }
                >
                  <MenuItem value="email">البريد الإلكتروني</MenuItem>
                  <MenuItem value="ftp">FTP</MenuItem>
                  <MenuItem value="s3">Amazon S3</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<CloudDownloadIcon />}
                onClick={handleExport}
              >
                تصدير المراجعات
              </Button>
              <FormControlLabel
                control={
                  <Switch
                    checked={exportSettings.enabled}
                    onChange={(e) =>
                      setExportSettings({
                        ...exportSettings,
                        enabled: e.target.checked,
                      })
                    }
                  />
                }
                label="تفعيل التصدير التلقائي"
              />
            </Stack>
          </Stack>
        </Paper>
      </Stack>

      {/* Add/Edit Notification Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'تعديل الإشعار' : 'إضافة إشعار جديد'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="نوع الإشعار"
              value={selectedNotification?.type || 'email'}
              onChange={(e) =>
                setSelectedNotification(prev =>
                  prev ? { ...prev, type: e.target.value as NotificationSettings['type'] } : null
                )
              }
            >
              <MenuItem value="email">بريد إلكتروني</MenuItem>
              <MenuItem value="slack">Slack</MenuItem>
              <MenuItem value="webhook">Webhook</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label={
                selectedNotification?.type === 'email'
                  ? 'البريد الإلكتروني'
                  : selectedNotification?.type === 'slack'
                  ? 'رابط Slack Webhook'
                  : 'رابط Webhook'
              }
              value={selectedNotification?.target || ''}
              onChange={(e) =>
                setSelectedNotification(prev =>
                  prev ? { ...prev, target: e.target.value } : null
                )
              }
            />

            <TextField
              select
              fullWidth
              label="الأحداث"
              value={selectedNotification?.events || []}
              onChange={(e) =>
                setSelectedNotification(prev =>
                  prev ? { ...prev, events: e.target.value } : null
                )
              }
              SelectProps={{
                multiple: true,
                renderValue: (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip
                        key={value}
                        label={
                          value === 'new_review'
                            ? 'مراجعة جديدة'
                            : value === 'reported_review'
                            ? 'إبلاغ عن مراجعة'
                            : 'تقييم منخفض'
                        }
                        size="small"
                      />
                    ))}
                  </Box>
                ),
              }}
            >
              <MenuItem value="new_review">مراجعة جديدة</MenuItem>
              <MenuItem value="reported_review">إبلاغ عن مراجعة</MenuItem>
              <MenuItem value="low_rating">تقييم منخفض</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button onClick={handleSaveNotification} variant="contained">
            {editMode ? 'تحديث' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
